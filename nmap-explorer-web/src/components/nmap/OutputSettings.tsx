import React from "react";
import { OUTPUT_FILE_OPTIONS, OUTPUT_EXTRA_OPTIONS } from "@/config/nmapOptions";
import { Card } from "./Card";
import "./OptionsPanel.css";

interface OutputSettingsProps {
  selectedOutputFormat: number | null;
  outputFilename: string;
  extraOptions: number[];
  onFormatChange: (id: number | null) => void;
  onFilenameChange: (filename: string) => void;
  onExtraToggle: (id: number) => void;
}

export function OutputSettings({
  selectedOutputFormat,
  outputFilename,
  extraOptions,
  onFormatChange,
  onFilenameChange,
  onExtraToggle,
}: OutputSettingsProps) {
  return (
    <Card title="Output Settings" icon="📄">
      <div className="output-settings">
        {/* Output Format Selection */}
        <div className="output-format-group">
          <p className="output-format-label">Output Format (select one):</p>
          <div className="output-format-options">
            {/* None option */}
            <label className={`output-format-option ${selectedOutputFormat === null ? "selected" : ""}`}>
              <input
                type="radio"
                name="output-format"
                checked={selectedOutputFormat === null}
                onChange={() => onFormatChange(null)}
              />
              <div className="output-format-info">
                <span className="output-format-desc">No file output (console only)</span>
              </div>
            </label>
            
            {OUTPUT_FILE_OPTIONS.map(option => (
              <label
                key={option.id}
                className={`output-format-option ${selectedOutputFormat === option.id ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="output-format"
                  checked={selectedOutputFormat === option.id}
                  onChange={() => onFormatChange(option.id)}
                />
                <div className="output-format-info">
                  <span className="output-format-flag">{option.flag}</span>
                  <span className="output-format-desc">{option.description}</span>
                </div>
              </label>
            ))}
          </div>
          
          {/* Filename input - only show when a format is selected */}
          {selectedOutputFormat !== null && (
            <div className="output-filename">
              <label className="nmap-label">Output Filename:</label>
              <input
                type="text"
                className="nmap-input"
                placeholder="scan_result"
                value={outputFilename}
                onChange={(e) => onFilenameChange(e.target.value)}
              />
              <p style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))", marginTop: "6px" }}>
                 A unique ID will be appended. Extension added automatically for -oA by nmap.
              </p>
            </div>
          )}
        </div>
        
        {/* Extra Output Options */}
        <div className="output-format-group">
          <p className="output-format-label">Additional Options:</p>
          <div className="output-extra-options">
            {OUTPUT_EXTRA_OPTIONS.map(option => (
              <label key={option.id} className="output-extra-option">
                <input
                  type="checkbox"
                  checked={extraOptions.includes(option.id)}
                  onChange={() => onExtraToggle(option.id)}
                />
                <span className="output-extra-label">
                  <span className="output-extra-flag">{option.flag}</span>
                  {option.description}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
