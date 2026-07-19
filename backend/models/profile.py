from pydantic import BaseModel
from typing import Optional

class ProfileModel(BaseModel):
    first_name: str
    surname: str
    email: str
    dob: Optional[str] = ""
    gender: Optional[str] = ""
    mobile: Optional[str] = ""
    address: Optional[str] = ""
    state: Optional[str] = ""
    highest_education: Optional[str] = ""
    twelfth_passed: Optional[str] = ""
    twelfth_board: Optional[str] = ""
    twelfth_percentage: Optional[str] = ""
    tenth_passed: Optional[str] = ""
    tenth_board: Optional[str] = ""
    tenth_percentage: Optional[str] = ""
    category: Optional[str] = ""
    physically_challenged: Optional[str] = ""
    nationality: Optional[str] = ""
    occupation: Optional[str] = ""
