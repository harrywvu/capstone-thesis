"""Loopback API for the offline OverFlow title-defense demo."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model import SECTORS, analyze, flood_result, scene_geometry, valid_sector

app = FastAPI(title="OverFlow synthetic demo API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


class AreaRequest(BaseModel):
    sectorId: str


class RainRequest(AreaRequest):
    intensityMmHr: float = Field(ge=0, le=150)
    durationHr: float = Field(ge=0, le=12)


class AnalysisRequest(RainRequest):
    affected: int = Field(ge=0, le=5000)
    vehicles: int = Field(ge=1, le=100)
    manualClosures: dict[str, bool]


def check_sector(sector_id: str) -> None:
    if not valid_sector(sector_id):
        raise HTTPException(status_code=404, detail="Unknown demo sector")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ready", "mode": "synthetic-offline"}


@app.post("/api/terrain")
def terrain(request: AreaRequest) -> dict:
    check_sector(request.sectorId)
    return {
        "sectorId": request.sectorId,
        "sectorLabel": SECTORS[request.sectorId],
        "synthetic": True,
        "geometry": scene_geometry(),
    }


@app.post("/api/simulate")
def simulate(request: RainRequest) -> dict:
    check_sector(request.sectorId)
    return {"sectorId": request.sectorId, "synthetic": True, **flood_result(request.intensityMmHr, request.durationHr)}


@app.post("/api/analyze")
def analysis(request: AnalysisRequest) -> dict:
    check_sector(request.sectorId)
    return {
        "sectorId": request.sectorId,
        "synthetic": True,
        **analyze(request.intensityMmHr, request.durationHr, request.affected, request.vehicles, request.manualClosures),
    }
