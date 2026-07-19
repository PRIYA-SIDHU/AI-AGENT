from fastapi import APIRouter
from backend.models.profile import ProfileModel
from backend.database.mongodb import get_db

router = APIRouter()

PROFILE_ID = "default_user"

@router.post("/profile")
async def save_profile(profile: ProfileModel):
    db = get_db()
    await db["profiles"].replace_one(
        {"_id": PROFILE_ID},
        {"_id": PROFILE_ID, **profile.model_dump()},
        upsert=True
    )
    return {"status": "saved"}

@router.get("/profile")
async def get_profile():
    db = get_db()
    doc = await db["profiles"].find_one({"_id": PROFILE_ID})
    if doc:
        doc.pop("_id", None)
        return doc
    return {}
