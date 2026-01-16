import React from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import "./AsyncStatus.css";

interface AsyncStatusProps {
  jobId: string;
  isPolling: boolean;
  pollCount: number;
  onStop: () => void;
}

export function AsyncStatus({ jobId, isPolling, pollCount, onStop }: AsyncStatusProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jobId);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = jobId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  return (
    <Card title="Async Scan Status" icon="🔄">
      <div className="async-status">
        <div className="async-job-info">
          <div className="async-job-row">
            <span className="async-label">Job ID:</span>
            <code className="async-job-id">{jobId}</code>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              📋 Copy
            </Button>
          </div>
          
          <div className="async-job-row">
            <span className="async-label">Status:</span>
            {isPolling ? (
              <span className="async-status-badge running">
                <span className="async-spinner" />
                Running
              </span>
            ) : (
              <span className="async-status-badge completed">
                Completed
              </span>
            )}
          </div>
          
          {isPolling && (
            <>
              <div className="async-job-row">
                <span className="async-label">Poll Count:</span>
                <span className="async-poll-count">{pollCount}</span>
              </div>
              
              <div className="async-progress">
                <div className="async-progress-bar">
                  <div className="async-progress-fill" />
                </div>
                <p className="async-progress-text">
                  Checking status every 3 seconds...
                </p>
              </div>
              
              <Button variant="danger" size="sm" onClick={onStop}>
                ⏹️ Stop Polling
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
