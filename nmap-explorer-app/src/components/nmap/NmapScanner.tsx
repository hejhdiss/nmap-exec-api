import React, { useState, useCallback } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { LoadingSpinner } from "./LoadingSpinner";
import { OptionsPanel } from "./OptionsPanel";
import { OutputSettings } from "./OutputSettings";
import { ScanResults } from "./ScanResults";
import { AsyncStatus } from "./AsyncStatus";
import { useAsyncPoll } from "@/hooks/useAsyncPoll";
import {
  runSyncScan,
  startAsyncScan,
  checkHealth,
  ScanOption,
  ScanResponse,
  JobStatusResponse,
} from "@/services/api";
import "./NmapScanner.css";

interface SelectedOption {
  id: number;
  value?: string;
}

export function NmapScanner() {
  // Target
  const [target, setTarget] = useState("");
  
  // Scan mode
  const [scanMode, setScanMode] = useState<"sync" | "async">("sync");
  
  // Options
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  
  // Output settings
  const [selectedOutputFormat, setSelectedOutputFormat] = useState<number | null>(null);
  const [outputFilename, setOutputFilename] = useState("");
  const [extraOptions, setExtraOptions] = useState<number[]>([]);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResponse | JobStatusResponse | null>(null);
  const [backendStatus, setBackendStatus] = useState<"unknown" | "online" | "offline">("unknown");

  // Async polling
  const {
    jobId,
    isPolling,
    pollCount,
    startPolling,
    stopPolling,
  } = useAsyncPoll({
    interval: 3000,
    onComplete: (res) => {
      setResult(res);
      setSuccess("Async scan completed successfully!");
      setIsLoading(false);
    },
    onError: (err) => {
      setError(err);
      setIsLoading(false);
    },
  });

  // Check backend health
  const handleCheckHealth = async () => {
    try {
      await checkHealth();
      setBackendStatus("online");
      setSuccess("Backend is online and ready!");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setBackendStatus("offline");
      setError("Backend is not reachable. Make sure it's running on localhost:8000");
    }
  };

  // Toggle option
  const handleToggleOption = useCallback((id: number, enabled: boolean, value?: string) => {
    setSelectedOptions(prev => {
      if (enabled) {
        const existing = prev.find(o => o.id === id);
        if (existing) {
          return prev.map(o => o.id === id ? { ...o, value } : o);
        }
        return [...prev, { id, value }];
      }
      return prev.filter(o => o.id !== id);
    });
  }, []);

  // Update option value
  const handleUpdateValue = useCallback((id: number, value: string) => {
    setSelectedOptions(prev =>
      prev.map(o => o.id === id ? { ...o, value } : o)
    );
  }, []);

  // Toggle extra option
  const handleExtraToggle = (id: number) => {
    setExtraOptions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Build options array for API
  const buildOptions = (): ScanOption[] => {
    const options: ScanOption[] = [];
    
    // Add selected scan options
    for (const opt of selectedOptions) {
      options.push({
        id: opt.id,
        value: opt.value || null,
      });
    }
    
    // Add output format if selected
    if (selectedOutputFormat !== null && outputFilename) {
      options.push({
        id: selectedOutputFormat,
        value: outputFilename,
      });
    }
    
    // Add extra options
    for (const id of extraOptions) {
      options.push({ id });
    }
    
    return options;
  };

  // Validate form
  const validateForm = (): string | null => {
    if (!target.trim()) {
      return "Please enter a target IP or hostname";
    }
    const scanningOptionsCount = selectedOptions.length ;
    if (scanningOptionsCount === 0) {
    return "Please select at least one scan option (e.g., Service Version or OS Detection).";
  }
    // Check if any option that needs input is missing value
    for (const opt of selectedOptions) {
      if (!opt.value || opt.value.trim().length === 0) {
      }
    }
    
    // Check output format
    if (selectedOutputFormat !== null && !outputFilename.trim()) {
      return "Please enter an output filename";
    }
    
    return null;
  };

  // Run scan
  const handleRunScan = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setSuccess(null);
    setResult(null);
    setIsLoading(true);
    
    const options = buildOptions();
    const request = { target: target.trim(), options };
    
    try {
      if (scanMode === "sync") {
        const response = await runSyncScan(request);
        
        if (response.error) {
          setError(response.error + (response.details ? `: ${response.details}` : ""));
        } else {
          setResult(response);
          setSuccess(response.message || "Scan completed successfully!");
        }
      } else {
        const response = await startAsyncScan(request);
        
        if (response.error) {
          setError(response.error);
        } else if (response.job_id) {
          setSuccess("Async scan started! Polling for results...");
          startPolling(response.job_id);
          return; // Don't set isLoading to false yet
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run scan");
    } finally {
      if (scanMode === "sync") {
        setIsLoading(false);
      }
    }
  };

  // Clear results
  const handleClear = () => {
    setResult(null);
    setError(null);
    setSuccess(null);
    stopPolling();
  };

  // Get selected options count
  const totalSelectedOptions = 
    selectedOptions.length + 
    (selectedOutputFormat !== null ? 1 : 0) + 
    extraOptions.length;

  return (
    <div className="nmap-scanner">
      {/* Header */}
      <header className="nmap-header">
        <div className="nmap-header-content">
          <h1 className="nmap-title">
            <span className="nmap-logo">🔍</span>
            Nmap Explorer
          </h1>
          <p className="nmap-subtitle">Network exploration and security auditing tool</p>
        </div>
        <div className="nmap-header-actions">
          <Button
            variant={backendStatus === "online" ? "success" : "secondary"}
            size="sm"
            onClick={handleCheckHealth}
          >
            {backendStatus === "online" ? "✓ Online" : "Check Backend"}
          </Button>
        </div>
      </header>

      {/* Alerts */}
      {error && (
        <Alert type="error" title="Error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && !result && (
        <Alert type="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <div className="nmap-content">
        {/* Left Column - Configuration */}
        <div className="nmap-config">
          {/* Target Input */}
          <Card title="Target" icon="🎯">
            <div className="target-input-group">
              <label className="nmap-label" htmlFor="target">
                Target IP or Hostname
              </label>
              <input
                id="target"
                type="text"
                className="nmap-input"
                placeholder="e.g., 192.168.1.1, scanme.nmap.org, 10.0.0.0/24"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <p className="target-hint">
                Enter an IP address, hostname, or CIDR notation
              </p>
            </div>
          </Card>

          {/* Scan Mode */}
          <Card title="Scan Mode" icon="⚡">
            <div className="scan-mode-group">
              <div className="nmap-toggle">
                <button
                  className={`nmap-toggle-option ${scanMode === "sync" ? "active" : ""}`}
                  onClick={() => setScanMode("sync")}
                  type="button"
                >
                  Synchronous
                </button>
                <button
                  className={`nmap-toggle-option ${scanMode === "async" ? "active" : ""}`}
                  onClick={() => setScanMode("async")}
                  type="button"
                >
                  Asynchronous
                </button>
              </div>
              <p className="scan-mode-hint">
                {scanMode === "sync"
                  ? "Wait for scan to complete. Best for quick scans."
                  : "Start scan in background and poll for results. Best for long scans."}
              </p>
            </div>
          </Card>

          {/* Options Panel */}
          <OptionsPanel
            selectedOptions={selectedOptions}
            onToggleOption={handleToggleOption}
            onUpdateValue={handleUpdateValue}
          />

          {/* Output Settings */}
          <OutputSettings
            selectedOutputFormat={selectedOutputFormat}
            outputFilename={outputFilename}
            extraOptions={extraOptions}
            onFormatChange={setSelectedOutputFormat}
            onFilenameChange={setOutputFilename}
            onExtraToggle={handleExtraToggle}
          />

          {/* Run Button */}
          <div className="scan-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={handleRunScan}
              loading={isLoading}
              disabled={!target.trim() || selectedOptions.length === 0}
            >
              {isLoading ? "Scanning..." : `🚀 Run Scan${totalSelectedOptions > 0 ? ` (${totalSelectedOptions} options)` : ""}`}
            </Button>
            
            {result && (
              <Button variant="secondary" size="lg" onClick={handleClear}>
                🗑️ Clear Results
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="nmap-results">
          {/* Async Status */}
          {jobId && (
            <AsyncStatus
              jobId={jobId}
              isPolling={isPolling}
              pollCount={pollCount}
              onStop={stopPolling}
            />
          )}

          {/* Loading State */}
          {isLoading && !isPolling && (
            <Card>
              <LoadingSpinner size="lg" text="Running Nmap scan..." />
            </Card>
          )}

          {/* Results */}
          {result && "output" in result && result.output && (
            <ScanResults
              output={result.output}
              outputFile={result.output_file}
              outputMode={result.output_mode}
              autoXml={result.auto_xml}
            />
          )}

          {/* Empty State */}
          {!isLoading && !result && !jobId && (
            <Card>
              <div className="empty-state">
                <span className="empty-state-icon">📡</span>
                <h3 className="empty-state-title">Ready to Scan</h3>
                <p className="empty-state-text">
                  Configure your scan options and click "Run Scan" to start.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
