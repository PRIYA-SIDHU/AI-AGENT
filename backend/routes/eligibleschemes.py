import json
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, HTTPException

from backend.database.mongodb import get_db

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[1]
SCHEMES_JSON_PATH = BASE_DIR / "data" / "dummy_schemes.json"


def _normalize(value: Optional[str]) -> str:
    return (value or "").strip().lower()


async def _load_profile() -> dict:
    db = get_db()
    doc = await db["profiles"].find_one({"_id": "default_user"})
    if doc:
        doc.pop("_id", None)
        return doc
    return {}


def _extract_age(profile: dict) -> Optional[int]:
    dob = profile.get("dob", "")
    if not dob:
        return None

    try:
        from datetime import date

        today = date.today()
        birth_date = date.fromisoformat(dob)
        age = today.year - birth_date.year - (
            (today.month, today.day) < (birth_date.month, birth_date.day)
        )
        return age
    except Exception:
        return None


def _scheme_matches_profile(profile: dict, scheme: dict) -> bool:
    if not profile:
        return False

    text = " ".join([
        scheme.get("name", ""),
        scheme.get("description", ""),
        scheme.get("eligibility", ""),
        scheme.get("category", ""),
    ]).lower()

    category = _normalize(profile.get("category"))
    gender = _normalize(profile.get("gender"))
    occupation = _normalize(profile.get("occupation"))
    physically_challenged = _normalize(profile.get("physically_challenged"))
    education = _normalize(profile.get("highest_education"))
    age = _extract_age(profile)

    # Category-based matching
    if category in {"sc", "obc", "st", "ews"}:
        category_tokens = {
            "sc": ["sc", "scheduled caste", "caste"],
            "obc": ["obc", "backward"],
            "st": ["st", "scheduled tribe"],
            "ews": ["ews", "economically weaker"],
        }
        if any(token in text for token in category_tokens.get(category, [])):
            return True

    # Gender-based matching
    if gender == "female" and any(token in text for token in ["girl", "woman", "women", "female"]):
        return True

    # Disability-based matching
    if physically_challenged in {"yes", "yes – locomotor", "yes – visual", "yes – hearing", "yes – other"} and any(
        token in text for token in ["disability", "specially-abled", "physically", "disabled"]
    ):
        return True

    # Occupation-based matching
    if occupation == "farmer" and any(token in text for token in ["farmer", "agriculture", "kisan", "farm"]):
        return True

    if occupation == "student" and any(
        token in text for token in ["student", "college", "school", "education", "scholarship", "degree", "course"]
    ):
        return True

    if occupation in {"self-employed", "employed", "unemployed"} and any(
        token in text for token in ["loan", "business", "enterprise", "employment", "job", "entrepreneur", "self-employment"]
    ):
        return True

    # Education-based matching
    if education in {"12th", "diploma", "graduation", "post graduation", "phd"} and any(
        token in text for token in ["student", "college", "school", "degree", "course", "education"]
    ):
        return True

    # Age-based matching
    if age is not None:
        if "18 and 40" in text and 18 <= age <= 40:
            return True
        if "18 and 50" in text and 18 <= age <= 50:
            return True
        if "18 and 70" in text and 18 <= age <= 70:
            return True
        if "above 18" in text and age > 18:
            return True

    # General open-to-all schemes
    if any(token in text for token in ["open to all", "all indian citizens", "all citizens", "all farmers", "all landholding"]):
        return True

    return False


@router.get("/eligibleschemes", summary="Return schemes matching the saved user profile")
async def get_eligible_schemes():
    try:
        profile = await _load_profile()

        with SCHEMES_JSON_PATH.open("r", encoding="utf-8") as f:
            schemes = json.load(f)

        filtered_schemes = [
            scheme for scheme in schemes
            if _scheme_matches_profile(profile, scheme)
        ]

        return filtered_schemes

    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Scheme data not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))