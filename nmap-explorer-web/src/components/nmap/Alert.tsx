import React from "react";
import "./common.css";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export function Alert({ type, title, children, onClose }: AlertProps) {
  return (
    <div className={`nmap-alert nmap-alert-${type}`}>
      <span className="nmap-alert-icon">{ICONS[type]}</span>
      <div className="nmap-alert-content">
        {title && <strong className="nmap-alert-title">{title}</strong>}
        <div className="nmap-alert-message">{children}</div>
      </div>
      {onClose && (
        <button className="nmap-alert-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
}
