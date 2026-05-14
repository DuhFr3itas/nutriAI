from pydantic import BaseModel, EmailStr

class PatientBase(BaseModel):
    name: str
    email: EmailStr
    age: int
    weight: float
    height: float
    goal: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True