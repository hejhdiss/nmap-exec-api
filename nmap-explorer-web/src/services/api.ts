// API service for Nmap Scanner backend

const API_BASE_URL = "http://localhost:8000";

export interface ScanOption {
  id: number;
  value?: string | number | null;
}

export interface ScanRequest {
  target: string;
  options: ScanOption[];
}

export interface ScanResponse {
  message?: string;
  output?: string;
  output_file?: string;
  output_mode?: number;
  auto_xml?: string;
  error?: string;
  details?: string;
}

export interface AsyncScanResponse {
  message?: string;
  job_id?: string;
  error?: string;
}

export interface JobStatusResponse {
  status?: string;
  message?: string;
  output?: string;
  output_file?: string;
  output_mode?: number;
  auto_xml?: string;
  error?: string;
  details?: string;
}

export interface FileResponse {
  output_mode?: string;
  content?: string;
  data?: HostData[];
  error?: string;
}

export interface HostData {
  address: string;
  status: string;
  ports: PortData[];
}

export interface PortData {
  port: number;
  protocol: string;
  state: string;
  service: string;
  banner: string;
}

// Health check
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/alive`);
  if (!response.ok) {
    throw new Error("Backend is not reachable");
  }
  return response.json();
}

// Synchronous scan
export async function runSyncScan(request: ScanRequest): Promise<ScanResponse> {
  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Async scan - start
export async function startAsyncScan(request: ScanRequest): Promise<AsyncScanResponse> {
  const response = await fetch(`${API_BASE_URL}/scan/async`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Async scan - check status
export async function checkJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/scan/async/${jobId}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Get file content
export async function getFileContent(outputFile: string, outputMode: number): Promise<FileResponse> {
  const params = new URLSearchParams({
    output_file: outputFile,
    output_mode: outputMode.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/file?${params}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}
