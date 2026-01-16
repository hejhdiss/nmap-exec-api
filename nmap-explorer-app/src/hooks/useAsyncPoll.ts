import { useState, useEffect, useRef, useCallback } from "react";
import { checkJobStatus, JobStatusResponse } from "@/services/api";

interface UseAsyncPollOptions {
  interval?: number;
  onComplete?: (result: JobStatusResponse) => void;
  onError?: (error: string) => void;
}

interface UseAsyncPollReturn {
  jobId: string | null;
  isPolling: boolean;
  pollCount: number;
  result: JobStatusResponse | null;
  error: string | null;
  startPolling: (jobId: string) => void;
  stopPolling: () => void;
}

export function useAsyncPoll(options: UseAsyncPollOptions = {}): UseAsyncPollReturn {
  const { interval = 3000, onComplete, onError } = options;
  
  const [jobId, setJobId] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [result, setResult] = useState<JobStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const jobIdRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const poll = useCallback(async () => {
    if (!jobIdRef.current) return;
    
    try {
      const status = await checkJobStatus(jobIdRef.current);
      setPollCount(prev => prev + 1);
      
      // Check if scan is complete (has output or error, no "running" status)
      if (status.status !== "running") {
        stopPolling();
        setResult(status);
        
        if (status.error) {
          setError(status.error);
          onError?.(status.error);
        } else {
          onComplete?.(status);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to check job status";
      setError(errorMessage);
      stopPolling();
      onError?.(errorMessage);
    }
  }, [stopPolling, onComplete, onError]);

  const startPolling = useCallback((newJobId: string) => {
    // Reset state
    setJobId(newJobId);
    jobIdRef.current = newJobId;
    setIsPolling(true);
    setPollCount(0);
    setResult(null);
    setError(null);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start polling
    intervalRef.current = setInterval(poll, interval);
    
    // Also poll immediately
    poll();
  }, [poll, interval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    jobId,
    isPolling,
    pollCount,
    result,
    error,
    startPolling,
    stopPolling,
  };
}
