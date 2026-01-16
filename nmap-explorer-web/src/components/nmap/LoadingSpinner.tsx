import React from "react";
import "./common.css";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function LoadingSpinner({ size = "md", text }: LoadingSpinnerProps) {
  return (
    <div className="nmap-loading">
      <div className={`nmap-spinner nmap-spinner-${size}`} />
      {text && <p className="nmap-loading-text">{text}</p>}
    </div>
  );
}
