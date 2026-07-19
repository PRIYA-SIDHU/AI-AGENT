import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[1]
SCHEMES_JSON_PATH = BASE_DIR / "data" / "dummy_schemes.json"


@router.get("/schemes", summary="Retrieve all government schemes")
async def get_schemes():
    try:
        with SCHEMES_JSON_PATH.open("r", encoding="utf-8") as f:
            schemes = json.load(f)
        return schemes
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Scheme data not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))