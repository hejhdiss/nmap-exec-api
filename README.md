# nmap-exec-api

A lightweight FastAPI-based Nmap execution API that enables developers to run authorized Nmap scans remotely using structured option IDs instead of raw shell commands.

## 🎯 Purpose

This project is **specifically designed as a building block for developers** who want to create:

- 🖥️ **Web-based Nmap GUIs** - Build intuitive dashboards and interfaces
- 🌐 **Remote scanning tools** - Enable network scanning from centralized servers
- 🤖 **Automation pipelines** - Integrate Nmap into CI/CD or security workflows
- 📊 **Security dashboards** - Create monitoring and reporting systems
- 🔧 **Internal security tools** - Develop custom solutions for your organization
- 📱 **Mobile/Desktop clients** - Build cross-platform Nmap interfaces

Instead of dealing with shell commands, subprocess management, and security concerns, developers can simply send JSON requests to this API.

## TL;DR

- This is a FastAPI wrapper around Nmap using structured option IDs
- Designed for **authorized scanning only**
- `nmap-testing.py` → developer boilerplate
- `main.py` → localhost testing tool (NOT production)
- Always add authentication, target validation, and rate limiting before deployment

---

## 🖥️ Desktop App (UI + Server Demo)

**Experimental / Demonstration Release**

A desktop UI demonstration of this project is available via GitHub Releases:

🔗 **Download:** https://github.com/hejhdiss/nmap-exec-api/releases/tag/v0.0.0

### What this release contains

This release includes two executable files:

- `server.exe` → runs the FastAPI-based Nmap execution backend
- `ui.exe` → a React + Vite desktop UI that connects to the local server

### How it works

1. Run `server.exe`
2. Then run `ui.exe`
3. The UI connects to the local server and provides a polished graphical interface for Nmap

This setup demonstrates how the API in this repository can be used to build a real desktop application, not just a web or CLI tool.

### 🔒 Localhost-only networking (important)

- Both the server and UI run strictly on loopback
- No outbound network connections are made by the application itself
- Nothing is exposed to your LAN or the internet by default

**Ports used:**

- Server: `127.0.0.1:8000`
- UI: `127.0.0.1:4565`

The UI communicates only with the local server over `localhost`, making this a self-contained local desktop setup.

### Important notes (read this)

- ❗ This is NOT an advanced or hardened security product
- ❗ This does NOT make Nmap more secure
- ❗ This is NOT a Zenmap replacement

**Instead, this demo focuses on:**

- ✔ Clean, modern UI
- ✔ Clear scan workflows
- ✔ Better usability for everyday Nmap users
- ✔ A design that treats Nmap as a first-class tool, not a hidden backend

Think of it as a highly polished UI layer over real Nmap, designed the way such a tool should feel.

### Who this is for

#### 🧑‍💻 Nmap users

If you regularly use Nmap and want:

- A cleaner interface
- Easier scan composition
- Better visibility into results

…this UI demo may genuinely help your workflow.

#### 🧠 Developers

If you are a developer, this release shows:

- How this API can be turned into a desktop application
- How a React + Vite UI can sit cleanly on top of the backend
- How this project can be expanded into a much larger application

**You are encouraged to:**

- Fork it
- Extend it
- Repackage it
- Build something bigger on top of it

### Platform note

- The provided binaries are Windows `.exe` files, because the author currently uses Windows
- The architecture is cross-platform
- You can compile and package this project for other environments such as Linux (AppImage / `.deb`) or macOS

The release exists to demonstrate the implementation, not to limit platforms.

### Licensing

This UI + server demo, like the rest of the project, is released under the **Apache License 2.0**.

**You are free to:**

- Modify it
- Redistribute it
- Use it commercially
- Build proprietary software on top of it

### Credits(ui.exe)

This desktop UI was created with the help of Lovable AI.

---

## 📁 Project Structure

This repository contains two implementations:

### 1. **`nmap-testing.py`** - Developer Boilerplate ⚙️

**This is the core file for developers.** Use this as your foundation to build custom Nmap integrations.

- ✅ Clean, minimal boilerplate code
- ✅ Easy to understand and modify
- ✅ Ready to integrate into your projects
- ✅ No additional dependencies beyond FastAPI
- ✅ Suitable for extending with your own features

**Use this when:**
- Building your own API service
- Integrating into existing applications
- Need to customize functionality
- Want full control over implementation

### 2. **`main.py`** - Ready-to-Run API 🚀

**This is NOT production-grade** but includes essential features for **localhost/loopback usage** and testing on your own devices.

Key features:
- 🔒 **Safe file handling** with automatic path sanitization
- 📂 **Automatic directory management** (`nmap_scans/` folder)
- 🗂️ **Auto-generated XML output** for all scans (for parsing)
- 📊 **Built-in XML parser** (`/file` endpoint with structured JSON output)
- 🔐 **Path traversal protection** (files restricted to `nmap_scans/` directory)
- 🎯 **Unique filenames** using UUID to prevent conflicts
- 🪟 **Windows-compatible** using Hypercorn (solves uvicorn SelectorEventLoop issues)
- 📝 **Output mode tracking** included in scan responses

**Use this when:**
- Testing locally with Postman/curl on 127.0.0.1
- Quick prototyping and experimentation on your own device
- Non-developers need a ready-to-use tool for local testing
- Want immediate functionality without modifications
- **Running on Windows** where uvicorn's SelectorEventLoop causes problems

## ⚠️ Disclaimer & Security Notice

**This tool is for authorized security testing only.**

- ✅ You must own or have explicit permission to scan the target
- ❌ The author is not responsible for misuse
- 🎓 Designed for development, automation, and research purposes

## Production-Grade Upgrades (Optional)

This project is a **lightweight boilerplate** designed to minimize dependencies and infrastructure requirements by default.  
It focuses on providing a clean, auditable foundation rather than a fully production-hardened service.

| Area | Default | Production Recommendation |
|----|----|----|
| Authentication | ❌ None | API keys / JWT / OAuth2 |
| Authorization | ❌ None | Role-based access control |
| Target validation | ❌ None | Asset allowlists / CIDR checks |
| Rate limiting | ❌ None | Per-user / per-IP limits |
| Job queue | In-memory asyncio | Redis + Celery (optional) |
| Job persistence | ❌ None | Redis / DB / file-backed store |
| Logging | Minimal | Structured logs / audit trails |
| Monitoring | ❌ None | Metrics & health monitoring |

> Advanced production features are intentionally excluded to **reduce dependencies**, avoid boilerplate complexity, and allow integrators to add only what their environment requires.


### 🔒 Important Security Considerations

**This API does NOT provide complete security validation.** It is designed as a foundation for developers to build upon.

⚠️ **What is NOT validated:**
- Target authorization (you can scan any IP/domain)
- User authentication and authorization
- Rate limiting per user/IP
- Network access controls beyond file paths

**It is the responsibility of the developer using this API to:**
- ✅ Implement proper authentication (OAuth2, JWT, API keys)
- ✅ Add authorization and access controls
- ✅ Validate and whitelist scan targets
- ✅ Implement rate limiting and abuse prevention
- ✅ Add network access controls
- ✅ Monitor and log all scan activities
- ✅ Deploy in a secure, isolated environment

**Recommended security measures:**
```python
# Example: Add authentication
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer

security = HTTPBearer()

@app.post("/scan")
async def scan(req: ScanRequest, token: str = Depends(security)):
    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Proceed with scan
```

This API provides the building blocks - **you must add the security layer** appropriate for your use case.

## ✨ Core Features (Both Implementations)

- 🚀 **REST API interface** for Nmap execution
- 🧱 **Structured option system** (ID-based, no raw commands)
- ⚡ **Dual execution modes**: Synchronous and Asynchronous
- 🔢 **Concurrency control** using async semaphore (max 3 concurrent scans)
- ❌ **Input validation** (rejects invalid or unsupported options)
- ⚙️ **Easy to extend** with new Nmap flags
- 🧩 **Integration-ready** for any programming language (JSON-based)
- 🛡️ **Security-focused** (prevents shell injection)

## ✨ Additional Features (`main.py` only)

- 📂 **Automatic file management** with `nmap_scans/` directory
- 🔐 **Path sanitization** (prevents directory traversal)
- 🆔 **UUID-based filenames** (prevents conflicts)
- 🗂️ **Auto-generated XML** for scans without explicit XML output (when using `-oN` or no output option)
- 📊 **Built-in XML parser** (converts to structured JSON)
- 📄 **File retrieval endpoint** (`/file`)
- 🪟 **Windows compatibility** using Hypercorn instead of uvicorn
- 📝 **Output mode tracking** in scan responses for easier file retrieval

## 🔎 Windows & Platform Disclaimer

**Platform support clarification**

The features listed above indicate **application-level compatibility** of `main.py`, not a guarantee of identical Nmap behavior across operating systems.

- ✅ This API **runs on Windows**, including proper subprocess handling, via **Hypercorn**
- ⚠️ **Nmap itself behaves differently on Windows vs Linux**
- ⚠️ Some scan types (e.g. SYN scans, OS detection, raw socket operations) may:
  - Require **administrator privileges**
  - Be **restricted or emulated** on Windows
  - Produce **different results** compared to Linux

This project **does not bypass Nmap privilege requirements**, elevate permissions, or normalize OS-specific scan behavior.

**Hypercorn** is used specifically to ensure the FastAPI application works correctly on Windows, where **uvicorn’s default event loop may fail to execute subprocess-based tools reliably**.

For **maximum Nmap capability, accuracy, and consistency**, **Linux or WSL is strongly recommended**.

**In short:**
- ✔️ This application supports Windows
- ❌ This does *not* mean Nmap has full or identical feature support on Windows


## 🛠 Requirements

- **Python 3.10+**
- **Nmap 7.98** or compatible version
- **Linux / WSL / macOS / Windows** (Windows now fully supported via Hypercorn)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/hejhdiss/nmap-exec-api.git
cd nmap-exec-api

# Install dependencies (for nmap-testing.py)
pip install fastapi uvicorn

# Install additional dependencies (for main.py)
pip install fastapi python-libnmap hypercorn

# Verify Nmap is installed
nmap --version
```

## ▶️ Running the API

### Option 1: Developer Boilerplate (`nmap-testing.py`)

```bash
uvicorn nmap-testing:app --host 0.0.0.0 --port 8000 --reload
```

### Option 2: Ready-to-Run API (`main.py`)

```bash
# Direct execution (recommended for local testing)
python main.py
```

**Why Hypercorn for main.py?**

The `main.py` implementation uses **Hypercorn** instead of uvicorn because:
- ✅ **Windows compatibility**: uvicorn uses `SelectorEventLoop` on Windows, which causes issues with subprocess execution
- ✅ **Better async support**: Hypercorn properly handles ProactorEventLoop on Windows
- ✅ **Reliable subprocess management**: Ensures Nmap scans execute correctly across all platforms

The API will be available at:
- Developer version: `http://0.0.0.0:8000`
- Main version: `http://127.0.0.1:8000`

API documentation: `http://localhost:8000/docs`

## 📡 API Endpoints (Core - Both Implementations)

### 1. `POST /scan` - Synchronous Scan

Execute an Nmap scan and wait for completion (best for quick scans).

**Request:**
```json
{
  "target": "scanme.nmap.org",
  "options": [
    { "id": 11 },
    { "id": 30 },
    { "id": 150, "value": "result.txt" }
  ]
}
```

**Response (nmap-testing.py):**
```json
{
  "message": "Nmap scan completed successfully",
  "output_file": "/path/to/result.txt",
  "output": "Starting Nmap 7.98..."
}
```

**Response (main.py):**
```json
{
  "message": "Nmap scan completed successfully",
  "output_file": "/absolute/path/nmap_scans/result_a1b2c3d4.txt",
  "output": "Starting Nmap 7.98...",
  "output_mode": 1,
  "auto_xml": "/absolute/path/nmap_scans/auto_e5f6g7h8.xml"
}
```

**Note:** The `output_mode` field indicates the type of output format:
- `1` - Normal text output (`-oN`)
- `2` - XML output (`-oX`)
- `3` - All formats (`-oA`)

### 2. `POST /scan/async` - Asynchronous Scan

Start a scan and get a job ID immediately (best for long-running scans).

**Request:**
```json
{
  "target": "192.168.1.0/24",
  "options": [
    { "id": 30 },
    { "id": 70 },
    { "id": 50, "value": "1-1000" }
  ]
}
```

**Response:**
```json
{
  "message": "Scan started",
  "job_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

### 3. `GET /scan/async/{job_id}` - Check Scan Status

**Response (Running):**
```json
{
  "status": "running"
}
```

**Response (Completed):**
```json
{
  "message": "Nmap scan completed successfully",
  "output_file": "/path/to/scan.txt",
  "output": "Nmap scan report...",
  "output_mode": 1,
  "auto_xml": "/path/to/auto.xml"
}
```

**Note:** `auto_xml` is only present if you used `-oN` or no output option. It won't be present for `-oX` or `-oA` scans. The `output_mode` field helps you determine which file retrieval mode to use.

**Response (Failed):**
```json
{
  "error": "Nmap scan failed",
  "details": "Error message from Nmap"
}
```

## 📡 Additional Endpoints (`main.py` only)

### 4. `GET /file` - Retrieve and Parse Scan Results

Retrieve scan output files with optional XML parsing.

**⚠️ IMPORTANT:** This endpoint **only accepts paths from scan results**. You must use the exact `output_file` or `auto_xml` path returned by the `/scan` or `/scan/async` endpoints. Attempting to access arbitrary files will result in an error.

**Request:**
```
GET /file?output_file=/absolute/path/nmap_scans/scan_abc123.txt&output_mode=1
```

**Query Parameters:**
- `output_file` - **Exact path from scan response** (from `output_file` or `auto_xml` fields)
- `output_mode`:
  - `1` - Normal text output (provide path ending with `.nmap` or `.txt`)
  - `2` - Parse XML and return structured JSON (provide path ending with `.xml` or use `auto_xml` from response)
  - `3` - Parse `-oA` output (**must provide base path without extension**, as returned in scan response)

**Pro Tip:** Use the `output_mode` field from the scan response to know which mode to use with the `/file` endpoint!

**Usage Notes:**
- **Mode 2**: If your scan didn't specify XML output (used `-oN` or no output option), an `auto_xml` file is created automatically. Use this path with mode 2 for parsing.
- **Mode 3**: For `-oA` scans (option ID 152), you **must** provide the exact base path from the scan response's `output_file` field. The API will automatically append `.xml` to find the XML file. Do not add `.xml` yourself.
- **auto_xml availability**: The `auto_xml` field only appears in responses when you use `-oN` (ID 150) or no output option. If you use `-oX` (ID 151) or `-oA` (ID 152), no `auto_xml` is created since these options already generate XML.

**Response (Mode 1 - Normal):**
```json
{
  "output_mode": "normal",
  "content": "Nmap scan report for scanme.nmap.org..."
}
```

**Response (Mode 2/3 - XML Parsed):**
```json
{
  "output_mode": "xml",
  "data": [
    {
      "address": "192.168.1.1",
      "status": "up",
      "ports": [
        {
          "port": 22,
          "protocol": "tcp",
          "state": "open",
          "service": "ssh",
          "banner": "OpenSSH 8.2"
        },
        {
          "port": 80,
          "protocol": "tcp",
          "state": "open",
          "service": "http",
          "banner": "nginx 1.18.0"
        }
      ]
    }
  ]
}
```

**Common Usage Patterns:**

```bash
# 1. Scans WITHOUT XML option (auto_xml is created, output_mode=1)
# Examples: No output option, or -oN used
# Scan response: {"auto_xml": "/path/auto_abc123.xml", "output_mode": 1, ...}
curl "http://localhost:8000/file?output_file=/path/auto_abc123.xml&output_mode=2"

# 2. Scans WITH -oX option (auto_xml NOT created, output_mode=2)
# Scan response: {"output_file": "/path/scan_xyz.xml", "output_mode": 2, ...}
curl "http://localhost:8000/file?output_file=/path/scan_xyz.xml&output_mode=2"

# 3. Scans WITH -oA option (auto_xml NOT created, output_mode=3)
# Scan response: {"output_file": "/path/scan_base", "output_mode": 3, ...}
curl "http://localhost:8000/file?output_file=/path/scan_base&output_mode=3"
```

### 5. `GET /alive` - Health Check

Simple endpoint to verify the API is running.

**Response:**
```json
{
  "status": "alive"
}
```

## 🧩 Option Model

```json
{
  "id": "<integer>",
  "value": "<string | integer | null>"
}
```

- **`id`** → Predefined Nmap option identifier
- **`value`** → Required only if the option needs input (optional otherwise)

## 🗂️ Available Options

### Target Specification

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 1 | `-iL` | ✅ | Input from list of hosts/networks |
| 2 | `-iR` | ✅ | Choose random targets |
| 3 | `--exclude` | ✅ | Exclude hosts/networks |
| 4 | `--excludefile` | ✅ | Exclude list from file |

### Host Discovery

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 10 | `-sL` | ❌ | List scan |
| 11 | `-sn` | ❌ | Ping scan (no port scan) |
| 12 | `-Pn` | ❌ | Skip host discovery |
| 13 | `-PS` | ✅ | TCP SYN discovery |
| 14 | `-PA` | ✅ | TCP ACK discovery |
| 15 | `-PU` | ✅ | UDP discovery |
| 16 | `-n` | ❌ | Never do DNS resolution |
| 17 | `-R` | ❌ | Always resolve DNS |
| 18 | `--dns-servers` | ✅ | Custom DNS servers |
| 19 | `--traceroute` | ❌ | Trace hop path |

### Scan Techniques

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 30 | `-sS` | ❌ | TCP SYN scan |
| 31 | `-sT` | ❌ | TCP connect scan |
| 32 | `-sA` | ❌ | TCP ACK scan |
| 33 | `-sW` | ❌ | TCP Window scan |
| 34 | `-sM` | ❌ | TCP Maimon scan |
| 35 | `-sU` | ❌ | UDP scan |
| 36 | `-sN` | ❌ | TCP Null scan |
| 37 | `-sF` | ❌ | TCP FIN scan |
| 38 | `-sX` | ❌ | TCP Xmas scan |
| 39 | `--scanflags` | ✅ | Custom TCP flags |
| 40 | `-sI` | ✅ | Idle scan |

### Port Specification

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 50 | `-p` | ✅ | Port range |
| 51 | `--exclude-ports` | ✅ | Exclude ports |
| 52 | `-F` | ❌ | Fast mode |
| 53 | `-r` | ❌ | Sequential scan |
| 54 | `--top-ports` | ✅ | Scan top N ports |

### Service/Version Detection

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 70 | `-sV` | ❌ | Version detection |
| 71 | `--version-intensity` | ✅ | Intensity (0-9) |
| 72 | `--version-light` | ❌ | Light mode |
| 73 | `--version-all` | ❌ | Try all probes |
| 74 | `--version-trace` | ❌ | Show details |

### OS Detection

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 90 | `-O` | ❌ | Enable OS detection |
| 91 | `--osscan-limit` | ❌ | Limit to promising targets |
| 92 | `--osscan-guess` | ❌ | Guess more aggressively |

### Timing and Performance

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 110 | `-T` | ✅ | Timing template (0-5) |
| 111 | `--host-timeout` | ✅ | Host timeout |
| 112 | `--min-rate` | ✅ | Minimum packet rate |
| 113 | `--max-rate` | ✅ | Maximum packet rate |

### Output

| ID | Flag | Input Required | Description |
|----|------|----------------|-------------|
| 150 | `-oN` | ✅ | Normal output file |
| 151 | `-oX` | ✅ | XML output file |
| 152 | `-oA` | ✅ | All output formats |
| 153 | `-v` | ❌ | Verbose |
| 154 | `--open` | ❌ | Only show open ports |

**Note:** Only ONE output option (150, 151, or 152) can be specified per scan.

## 🧪 Usage Examples

### Example 1: Quick Scan (Synchronous)

```bash
curl -X POST "http://localhost:8000/scan" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "scanme.nmap.org",
    "options": [
      { "id": 30 },
      { "id": 50, "value": "80,443" }
    ]
  }'
```

### Example 2: Long Scan (Asynchronous)

```bash
# Start scan
curl -X POST "http://localhost:8000/scan/async" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "192.168.1.0/24",
    "options": [
      { "id": 30 },
      { "id": 70 },
      { "id": 150, "value": "network_scan.txt" }
    ]
  }'

# Response: {"message": "Scan started", "job_id": "abc123..."}

# Check status
curl "http://localhost:8000/scan/async/abc123..."
```

### Example 3: Retrieve Parsed Results (main.py only)

```bash
# Scenario 1: Scan WITHOUT XML output (auto_xml IS created)
# Using no output option
curl -X POST "http://localhost:8000/scan" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "scanme.nmap.org",
    "options": [{"id": 30}]
  }'

# Response:
# {
#   "message": "Nmap scan completed successfully",
#   "output_file": "",
#   "output_mode": null,
#   "auto_xml": "/path/nmap_scans/auto_xyz789.xml"  ← Created automatically
# }

# Get parsed results using auto_xml with mode 2
curl "http://localhost:8000/file?output_file=/path/nmap_scans/auto_xyz789.xml&output_mode=2"

# =====================================

# Scenario 2: Scan WITH -oN (auto_xml IS created, output_mode=1)
curl -X POST "http://localhost:8000/scan" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "scanme.nmap.org",
    "options": [
      {"id": 30},
      {"id": 150, "value": "scan.txt"}
    ]
  }'

# Response:
# {
#   "output_file": "/path/nmap_scans/scan_abc123.txt",
#   "output_mode": 1,  ← Indicates -oN format
#   "auto_xml": "/path/nmap_scans/auto_def456.xml"  ← Created automatically
# }

# Get parsed results using auto_xml
curl "http://localhost:8000/file?output_file=/path/nmap_scans/auto_def456.xml&output_mode=2"

# =====================================

# Scenario 3: Scan WITH -oA (auto_xml NOT created, output_mode=3)
curl -X POST "http://localhost:8000/scan" \
  -H "Content-Type: application/json" \
  -d '{
    "target": "scanme.nmap.org",
    "options": [
      {"id": 30},
      {"id": 152, "value": "network_scan"}
    ]
  }'

# Response:
# {
#   "output_file": "/path/nmap_scans/network_scan_abc123",
#   "output_mode": 3  ← Indicates -oA format, use mode 3 for retrieval
#   # Note: NO auto_xml field - not needed since -oA creates XML
# }

# Get parsed results using base path with mode 3
curl "http://localhost:8000/file?output_file=/path/nmap_scans/network_scan_abc123&output_mode=3"

# ⚠️ IMPORTANT: auto_xml creation rules
# ✅ auto_xml CREATED:     No output option, or -oN used
# ❌ auto_xml NOT created: -oX or -oA used (they already create XML)
# ✅ Mode 2 usage:         Use auto_xml path or explicit XML path
# ✅ Mode 3 usage:         Use base path from -oA (without .xml)
# ✅ Use output_mode:      From scan response to determine correct retrieval mode
```

### Example 4: JavaScript Client

```javascript
async function runAsyncScan() {
  // Start scan
  const startResp = await fetch('http://localhost:8000/scan/async', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      target: '192.168.1.1',
      options: [
        {id: 30},
        {id: 70},
        {id: 50, value: '1-1000'}
      ]
    })
  });
  
  const {job_id} = await startResp.json();
  console.log('Scan started:', job_id);
  
  // Poll for results
  const checkStatus = async () => {
    const statusResp = await fetch(`http://localhost:8000/scan/async/${job_id}`);
    const status = await statusResp.json();
    
    if (status.message) {
      console.log('Scan completed!', status);
      clearInterval(interval);
      
      // Use output_mode from response to determine how to retrieve file
      const outputMode = status.output_mode || 2; // Default to XML parsing
      const filePath = status.auto_xml || status.output_file;
      
      if (filePath) {
        const fileResp = await fetch(
          `http://localhost:8000/file?output_file=${filePath}&output_mode=${outputMode}`
        );
        const parsedData = await fileResp.json();
        console.log('Parsed results:', parsedData);
      }
    } else if (status.error) {
      console.error('Scan failed:', status);
      clearInterval(interval);
    }
  };
  
  const interval = setInterval(checkStatus, 5000);
}

// Example: Using output_mode for intelligent retrieval
async function retrieveScanResults(scanResponse) {
  const mode = scanResponse.output_mode;
  const path = scanResponse.auto_xml || scanResponse.output_file;
  
  if (!path) {
    console.log('No output file available');
    return;
  }
  
  // Use mode from scan response (or default to 2 for XML parsing)
  const retrievalMode = mode || 2;
  
  const fileResp = await fetch(
    `http://localhost:8000/file?output_file=${path}&output_mode=${retrievalMode}`
  );
  const data = await fileResp.json();
  
  if (data.output_mode === 'xml') {
    console.log('Parsed hosts:', data.data);
  } else {
    console.log('Raw output:', data.content);
  }
}
```

## 🔧 Security Features (`main.py`)

### 1. Path Sanitization
```python
def safe_output_path(user_value: str) -> str:
    # Extracts filename only (no directory traversal)
    base = os.path.basename(user_value)
    # Adds UUID to prevent conflicts
    uid = uuid.uuid4().hex
    # Forces file into nmap_scans/ directory
    return os.path.join(BASE_DIR, f"{name}_{uid}{ext}")
```

### 2. File Access Validation
```python
# Only files in nmap_scans/ can be accessed
if os.path.join(BASE_DIR, filename) != requested_path:
    return {"error": "Invalid file path"}
```

**Important:** The `/file` endpoint **only accepts paths returned by scan operations**. You cannot access arbitrary files on the system. The API enforces that:
- Files must be in the `nmap_scans/` directory
- Paths must match exactly what was returned in scan responses
- Especially for mode 3 (`-oA`), you must use the exact base path from `output_file`

This design ensures the API only serves files it created, preventing unauthorized file access.

### 3. Automatic XML Generation
```python
# Auto-generate XML for scans without explicit XML output
has_xml = any(op.id in (151, 152) for op in options)
if not has_xml:
    auto_xml = safe_output_path("auto.xml")
    cmd.extend(["-oX", auto_xml])
```

**When `auto_xml` is created:**
- ✅ No output option specified
- ✅ Using `-oN` (option ID 150) - normal text output

**When `auto_xml` is NOT created:**
- ❌ Using `-oX` (option ID 151) - already creates XML
- ❌ Using `-oA` (option ID 152) - already creates XML

This ensures parsed data is always available, even when users only request text output or no output at all.

### 4. Windows Compatibility (Hypercorn)
```python
# Uses Hypercorn instead of uvicorn for Windows compatibility
from hypercorn.config import Config
from hypercorn.asyncio import serve

if __name__ == "__main__":
    config = Config()
    config.bind = ["127.0.0.1:8000"]
    config.use_reloader = True
    asyncio.run(serve(app, config))
```

**Why this matters:**
- ✅ **Fixes Windows subprocess issues**: uvicorn's SelectorEventLoop doesn't properly handle subprocess execution on Windows
- ✅ **Better async compatibility**: Hypercorn uses ProactorEventLoop on Windows
- ✅ **Reliable scanning**: Ensures Nmap scans complete successfully across all platforms

## 🚀 Quick Start Guide

### For Developers (nmap-testing.py)

1. Clone and install dependencies
2. Modify `nmap-testing.py` for your needs
3. Add authentication, validation, etc.
4. Deploy to your infrastructure

### For Quick Testing (main.py)

1. Clone and install dependencies (including `python-libnmap` and `hypercorn`)
2. Run `python main.py`
3. Use Postman/curl to test on localhost (127.0.0.1:8000)
4. Check `nmap_scans/` folder for results
5. **Note:** This is for local testing only, not production deployment
6. **Windows users:** Hypercorn ensures proper subprocess handling!

## 🧩 Extending the API

Adding new Nmap options is simple:

```python
# Add to the relevant dictionary
SCAN_TECHNIQUES = {
    30: {"flag": "-sS", "needs_input": False},
    # Add your option:
    41: {"flag": "-sY", "needs_input": False}  # SCTP scan
}
```

No API endpoint changes needed!

## 📊 Key Differences Summary

| Feature | nmap-testing.py | main.py |
|---------|----------------|---------|
| **Purpose** | Developer boilerplate | Local/loopback testing |
| **Production ready** | Build on it | ❌ No (localhost only) |
| **File handling** | Manual | Automatic + sanitized |
| **Output directory** | User specified | `nmap_scans/` |
| **File conflicts** | Checks existence | UUID prevents conflicts |
| **XML parsing** | No | Yes (`/file` endpoint) |
| **Auto XML** | No | Yes (always generated) |
| **Output mode** | No | Yes (tracked in response) |
| **Server** | uvicorn | Hypercorn |
| **Windows support** | May have issues | ✅ Full support |
| **Dependencies** | Minimal | Includes `python-libnmap`, `hypercorn` |
| **Target users** | Developers | Testers/Local use |
| **Customization** | Easy | Not needed |
| **Deployment** | Add auth & deploy | localhost:8000 only |


## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/hejhdiss/nmap-exec-api/issues).

## 📄 License

```
Apache License 2.0
```

You are free to:

- ✅ Use commercially or privately
- ✅ Modify and distribute
- ✅ Build proprietary tools
- ✅ Include in larger projects

**Attribution appreciated** ❤️

## 👤 Author

**Muhammed Shafin P**

- GitHub: [@hejhdiss](https://github.com/hejhdiss)
- Licensed under Apache 2.0

## ⭐ Show Your Support

If this project helps you build something cool, please give it a ⭐ on GitHub!

---

**Built with ❤️ for developers building security tools**
