import React from "react";
import "./common.css";

interface CardProps {
  title?: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, icon, children, className = "" }: CardProps) {
  return (
    <div className={`nmap-card ${className}`}>
      {title && (
        <div className="nmap-card-header">
          {icon && <span className="nmap-card-icon">{icon}</span>}
          <h3 className="nmap-card-title">{title}</h3>
        </div>
      )}
      <div className="nmap-card-content">{children}</div>
    </div>
  );
}
