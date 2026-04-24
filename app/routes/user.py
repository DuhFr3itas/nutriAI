from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.security import hash_password, verify_password, create_access_token

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    new_user = User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        age=user.age,
        weight=user.weight,
        height=user.height,
        daily_calorie_goal=user.daily_calorie_goal,
        daily_water_goal_ml=user.daily_water_goal_ml,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# Aqui fica apenas a função de login NOVA com o formulário OAuth2
@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    # O padrão OAuth2 usa o campo 'username', mas nós vamos preencher ele com o email!
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    if not verify_password(form_data.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }