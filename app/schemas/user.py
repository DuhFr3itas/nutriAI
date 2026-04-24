from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: int | None = None
    weight: float | None = None
    height: float | None = None
    daily_calorie_goal: int | None = None
    daily_water_goal_ml: int | None = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int | None = None
    weight: float | None = None
    height: float | None = None
    daily_calorie_goal: int | None = None
    daily_water_goal_ml: int | None = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str