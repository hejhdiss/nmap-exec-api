import React, { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { HostData, getFileContent, FileResponse } from "@/services/api";
import "./ScanResults.css";

interface ScanResultsProps {
  output: string;
  outputFile?: string;
  outputMode?: number;
  autoXml?: string;
}

export function ScanResults({ output, outputFile, outputMode, autoXml }: ScanResultsProps) {
  const [activeTab, setActiveTab] = useState<"raw" | "parsed">("raw");
  const [parsedData, setParsedData] = useState<HostData[] | null>(null);
  const [parseLoading, setParseLoading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleViewParsed = async () => {
    if (parsedData) {
      setActiveTab("parsed");
      return;
    }

    setParseLoading(true);
    setParseError(null);

    try {
      let response: FileResponse;
      
      // If we have XML output or auto_xml, use that for parsing
      if (outputMode === 2 && outputFile) {
        // XML output
        response = await getFileContent(outputFile, 2);
      } else if (outputMode === 3 && outputFile) {
        // All outputs - use XML version
        response = await getFileContent(outputFile, 3);
      } else if (autoXml) {
        // Use auto-generated XML
        response = await getFileContent(autoXml, 2);
      } else {
        setParseError("No XML data available for parsing");
        setParseLoading(false);
        return;
      }

      if (response.error) {
        setParseError(response.error);
      } else if (response.data) {
        setParsedData(response.data);
        setActiveTab("parsed");
      }
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to parse XML");
    } finally {
      setParseLoading(false);
    }
  };

  const handleViewFile = async () => {
    if (!outputFile || !outputMode) return;

    setParseLoading(true);
    setParseError(null);

    try {
      const response = await getFileContent(outputFile, outputMode);
      
      if (response.error) {
        setParseError(response.error);
      } else if (response.content) {
        setFileContent(response.content);
      } else if (response.data) {
        setParsedData(response.data);
        setActiveTab("parsed");
      }
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Failed to get file");
    } finally {
      setParseLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nmap_scan_output.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canViewParsed = outputMode === 2 || outputMode === 3 || autoXml;

  return (
    <Card title="Scan Results" icon="📊">
      <div className="scan-results">
        {/* Tab Bar */}
        <div className="results-tabs">
          <button
            className={`results-tab ${activeTab === "raw" ? "active" : ""}`}
            onClick={() => setActiveTab("raw")}
          >
            Raw Output
          </button>
          <button
            className={`results-tab ${activeTab === "parsed" ? "active" : ""}`}
            onClick={handleViewParsed}
            disabled={!canViewParsed || parseLoading}
          >
            {parseLoading ? "Loading..." : "Parsed View"}
          </button>
        </div>

        {/* Actions */}
        <div className="results-actions">
          <Button variant="secondary" size="sm" onClick={handleDownload}>
            📥 Download Raw
          </Button>
          {outputFile && outputMode && (
            <Button variant="secondary" size="sm" onClick={handleViewFile} loading={parseLoading}>
              📁 View Saved File
            </Button>
          )}
        </div>

        {/* Error */}
        {parseError && (
          <div className="results-error">{parseError}</div>
        )}

        {/* Content */}
        <div className="results-content">
          {activeTab === "raw" && (
            <pre className="results-raw">{fileContent || output}</pre>
          )}
          
          {activeTab === "parsed" && parsedData && (
            <div className="results-parsed">
              {parsedData.length === 0 ? (
                <p className="results-empty">No hosts found in scan results.</p>
              ) : (
                parsedData.map((host, index) => (
                  <div key={index} className="host-card">
                    <div className="host-header">
                      <span className="host-address">🖥️ {host.address}</span>
                      <span className={`host-status ${host.status === "up" ? "up" : "down"}`}>
                        {host.status}
                      </span>
                    </div>
                    
                    {host.ports.length > 0 ? (
                      <table className="ports-table">
                        <thead>
                          <tr>
                            <th>Port</th>
                            <th>Protocol</th>
                            <th>State</th>
                            <th>Service</th>
                            <th>Banner</th>
                          </tr>
                        </thead>
                        <tbody>
                          {host.ports.map((port, pIndex) => (
                            <tr key={pIndex}>
                              <td className="port-number">{port.port}</td>
                              <td>{port.protocol}</td>
                              <td>
                                <span className={`port-state ${port.state}`}>
                                  {port.state}
                                </span>
                              </td>
                              <td>{port.service || "-"}</td>
                              <td className="port-banner">{port.banner || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-ports">No open ports found</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
