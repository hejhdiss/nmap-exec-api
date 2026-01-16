import React from "react";
import "./common.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`nmap-button nmap-button-${variant} nmap-button-${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="nmap-button-spinner" />
      ) : icon ? (
        <span className="nmap-button-icon">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
