from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
import subprocess
import uuid
import json

app = FastAPI(
    title="nuclei-exec-api",
    description="Nuclei Execution API with Template Support",
    version="1.0.0"
)

# -------------------------
# In-memory job store
# -------------------------
JOBS = {}

# -------------------------
# Models
# -------------------------
TemplateMode = Literal["category", "ids", "path", "severity"]

class TemplateConfig(BaseModel):
    mode: TemplateMode
    value: List[str]

class NucleiScanRequest(BaseModel):
    target: str
    templates: Optional[TemplateConfig] = None
    severity: Optional[List[str]] = None
    rate_limit: Optional[int] = 150
    json: bool = True

# -------------------------
# Helpers
# -------------------------
def create_job():
    job_id = uuid.uuid4().hex
    JOBS[job_id] = {
        "status": "running",
        "results": []
    }
    return job_id

def build_nuclei_cmd(req: NucleiScanRequest):
    cmd = ["nuclei", "-u", req.target]

    if req.templates:
        if req.templates.mode == "category":
            for cat in req.templates.value:
                cmd += ["-t", f"{cat}/"]

        elif req.templates.mode == "ids":
            cmd += ["-id", ",".join(req.templates.value)]

        elif req.templates.mode == "path":
            cmd += ["-t", req.templates.value[0]]

        elif req.templates.mode == "severity":
            cmd += ["-severity", ",".join(req.templates.value)]

    if req.severity:
        cmd += ["-severity", ",".join(req.severity)]

    cmd += ["-rate-limit", str(req.rate_limit)]

    if req.json:
        cmd.append("-json")

    return cmd

def run_nuclei(job_id: str, cmd: list):
    try:
        process = subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )

        for line in process.stdout:
            try:
                JOBS[job_id]["results"].append(json.loads(line))
            except json.JSONDecodeError:
                continue

        process.wait()
        JOBS[job_id]["status"] = "completed"

    except Exception as e:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = str(e)

# -------------------------
# API Endpoints
# -------------------------
@app.post("/nuclei/scan")
def start_scan(req: NucleiScanRequest, bg: BackgroundTasks):
    cmd = build_nuclei_cmd(req)

    job_id = create_job()
    bg.add_task(run_nuclei, job_id, cmd)

    return {
        "job_id": job_id,
        "status": "running",
        "command": cmd
    }

@app.get("/jobs/{job_id}")
def get_job(job_id: str):
    job = JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.get("/nuclei/templates")
def list_templates():
    result = subprocess.run(
        ["nuclei", "-tl"],
        capture_output=True,
        text=True
    )
    return {"templates": result.stdout}

@app.post("/nuclei/templates/update")
def update_templates():
    subprocess.run(["nuclei", "-update-templates"])
    return {"status": "templates updated"}
