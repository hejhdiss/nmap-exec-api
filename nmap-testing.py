# Licensed under the Apache License, Version 2.0 (the "License")
# @hejhdiss (Muhammed Shafin P)
# Options are from Nmap 7.98 help

import asyncio
import uuid

SCAN_JOBS = {}

TARGET_SPEC = {
    1: {
        "flag": "-iL",
        "needs_input": True,
        "input_key": "input_file",
        "description": "Input from list of hosts/networks"
    },
    2: {
        "flag": "-iR",
        "needs_input": True,
        "input_key": "random_hosts",
        "description": "Choose random targets"
    },
    3: {
        "flag": "--exclude",
        "needs_input": True,
        "input_key": "exclude_hosts",
        "description": "Exclude hosts/networks"
    },
    4: {
        "flag": "--excludefile",
        "needs_input": True,
        "input_key": "exclude_file",
        "description": "Exclude list from file"
    }
}
HOST_DISCOVERY = {
    10: {"flag": "-sL", "needs_input": False},
    11: {"flag": "-sn", "needs_input": False},
    12: {"flag": "-Pn", "needs_input": False},
    13: {
        "flag": "-PS",
        "needs_input": True,
        "input_key": "tcp_syn_ports"
    },
    14: {
        "flag": "-PA",
        "needs_input": True,
        "input_key": "tcp_ack_ports"
    },
    15: {
        "flag": "-PU",
        "needs_input": True,
        "input_key": "udp_ports"
    },
    16: {"flag": "-n", "needs_input": False},
    17: {"flag": "-R", "needs_input": False},
    18: {
        "flag": "--dns-servers",
        "needs_input": True,
        "input_key": "dns_servers"
    },
    19: {"flag": "--traceroute", "needs_input": False}
}
SCAN_TECHNIQUES = {
    30: {"flag": "-sS", "needs_input": False},
    31: {"flag": "-sT", "needs_input": False},
    32: {"flag": "-sA", "needs_input": False},
    33: {"flag": "-sW", "needs_input": False},
    34: {"flag": "-sM", "needs_input": False},
    35: {"flag": "-sU", "needs_input": False},
    36: {"flag": "-sN", "needs_input": False},
    37: {"flag": "-sF", "needs_input": False},
    38: {"flag": "-sX", "needs_input": False},
    39: {
        "flag": "--scanflags",
        "needs_input": True,
        "input_key": "tcp_flags"
    },
    40: {
        "flag": "-sI",
        "needs_input": True,
        "input_key": "zombie_host"
    }
}
PORT_SPEC = {
    50: {
        "flag": "-p",
        "needs_input": True,
        "input_key": "ports"
    },
    51: {
        "flag": "--exclude-ports",
        "needs_input": True,
        "input_key": "exclude_ports"
    },
    52: {"flag": "-F", "needs_input": False},
    53: {"flag": "-r", "needs_input": False},
    54: {
        "flag": "--top-ports",
        "needs_input": True,
        "input_key": "top_ports"
    }
}
SERVICE_VERSION = {
    70: {"flag": "-sV", "needs_input": False},
    71: {
        "flag": "--version-intensity",
        "needs_input": True,
        "input_key": "intensity"
    },
    72: {"flag": "--version-light", "needs_input": False},
    73: {"flag": "--version-all", "needs_input": False},
    74: {"flag": "--version-trace", "needs_input": False}
}
OS_DETECTION = {
    90: {"flag": "-O", "needs_input": False},
    91: {"flag": "--osscan-limit", "needs_input": False},
    92: {"flag": "--osscan-guess", "needs_input": False}
}
TIMING = {
    110: {
        "flag": "-T",
        "needs_input": True,
        "input_key": "timing_template"
    },
    111: {
        "flag": "--host-timeout",
        "needs_input": True,
        "input_key": "timeout"
    },
    112: {
        "flag": "--min-rate",
        "needs_input": True,
        "input_key": "min_rate"
    },
    113: {
        "flag": "--max-rate",
        "needs_input": True,
        "input_key": "max_rate"
    }
}
OUTPUT = {
    150: {
        "flag": "-oN",
        "needs_input": True,
        "input_key": "normal_output"
    },
    151: {
        "flag": "-oX",
        "needs_input": True,
        "input_key": "xml_output"
    },
    152: {
        "flag": "-oA",
        "needs_input": True,
        "input_key": "all_outputs"
    },
    153: {"flag": "-v", "needs_input": False},
    154: {"flag": "--open", "needs_input": False}
}

from fastapi import FastAPI
app = FastAPI()
from pydantic import BaseModel
from typing import List, Optional, Union
import os

class Option(BaseModel):
    id: int
    value: Optional[Union[str, int]] = None

class ScanRequest(BaseModel):
    target: str
    options: List[Option]
OUTPUT_IDS = {
    150: 1,  # -oN
    151: 2,  # -oX
    152: 3   # -oA
}
SCAN_LIMIT = asyncio.Semaphore(3)   
@app.post("/scan")
async def scan_sync(req: ScanRequest):
    c=0
    for op in req.options:
        if op.id==150 and op.value is not None:
            c+=1
        if op.id==151 and op.value is not None:
            c+=1
        if op.id==152 and op.value is not None:
            c+=1
    if c>1:
        return {"error": "Multiple output options specified. Please specify only one output option."}
    try:
        cmd, path, mode = command_build(req.target, req.options)
    except (TypeError, ValueError) as e:
        return {"error": str(e)}

    fpath=os.path.abspath(path) if path else None
    if fpath and os.path.exists(fpath):
        return {"error": f"Output file {fpath} already exists. Please choose a different file name."}
    
    async with SCAN_LIMIT:
        result = await run_nmap(cmd)
    if result["returncode"] != 0:
        return {
            "error": "Nmap scan failed",
            "details": result["stderr"]
        }
    ren={
        "message": "Nmap scan completed successfully",  
        "output_file": '',
        "output": result["stdout"]
    } if fpath is None else {
        "message": "Nmap scan completed successfully",
        "output_file": fpath,
        "output": result["stdout"]
    }
    return ren

ALL_OPTIONS = {}
ALL_OPTIONS.update(TARGET_SPEC)
ALL_OPTIONS.update(HOST_DISCOVERY)
ALL_OPTIONS.update(SCAN_TECHNIQUES)
ALL_OPTIONS.update(PORT_SPEC)
ALL_OPTIONS.update(SERVICE_VERSION)
ALL_OPTIONS.update(OS_DETECTION)
ALL_OPTIONS.update(TIMING)
ALL_OPTIONS.update(OUTPUT)

def command_build(target: str, options: list[Option]):
    cmd = ["nmap"]
    output_path = None
    output_mode = None

    for op in options:
        spec = ALL_OPTIONS.get(op.id)
        if not spec:
            raise ValueError(f"Unsupported option ID: {op.id}")

        if spec["needs_input"] and op.value is None:
            raise ValueError(f"Option {op.id} requires input")

        if op.id in OUTPUT_IDS:
            output_path = op.value
            output_mode = OUTPUT_IDS[op.id]

        cmd.append(spec["flag"])
        if spec["needs_input"]:
            cmd.append(str(op.value))
    cmd.append(target)
    if output_path and os.path.dirname(output_path):
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
    return cmd, output_path, output_mode



async def run_nmap(cmd: list[str]):
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )

    stdout, stderr = await process.communicate()

    return {
        "returncode": process.returncode,
        "stdout": stdout.decode(errors="ignore"),
        "stderr": stderr.decode(errors="ignore"),
    }

async def run_scan_job(job_id: str, cmd: list[str], output_path: Optional[str] = None):
    async with SCAN_LIMIT:
        result = await run_nmap(cmd)

    
    if result["returncode"] != 0:
        SCAN_JOBS[job_id] = {
            "error": "Nmap scan failed",
            "details": result["stderr"]
        }
    else:

        SCAN_JOBS[job_id] ={
            "message": "Nmap scan completed successfully",  
            "output_file": '',
            "output": result["stdout"]
        } if output_path is None else {
            "message": "Nmap scan completed successfully",
            "output_file": output_path,
            "output": result["stdout"]
        }
    
from fastapi import BackgroundTasks

@app.post("/scan/async")
async def scan_async(req: ScanRequest, background_tasks: BackgroundTasks):
    try:
        cmd, path, mode = command_build(req.target, req.options)
    except (TypeError, ValueError) as e:
        return {"error": str(e)}

    fpath = os.path.abspath(path) if path else None

    if fpath and os.path.exists(fpath):
        return {"error": f"Output file {fpath} already exists. Please choose a different file name."}

    job_id = str(uuid.uuid4())
    SCAN_JOBS[job_id] = {"status": "running"}

    background_tasks.add_task(run_scan_job, job_id, cmd, fpath)

    return {
        "message": "Scan started",
        "job_id": job_id
    }

@app.get("/scan/async/{job_id}")
async def scan_status(job_id: str):
    job = SCAN_JOBS.get(job_id)
    if not job:
        return {"error": "Invalid job ID"}
    return job

