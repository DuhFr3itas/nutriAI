<<<<<<< HEAD
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
=======
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f

from app.database.connection import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
<<<<<<< HEAD
from app.services.security import create_access_token, get_current_user, hash_password, verify_password

router = APIRouter(tags=["Usuários e Login"])


@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
=======
from app.services.security import hash_password, verify_password, create_access_token

router = APIRouter()


@router.get("/users", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.post("/users", response_model=UserResponse)
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
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


<<<<<<< HEAD
@router.get("/users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/users", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(User).filter(User.id == current_user.id).all()


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    db_user = db.query(User).filter(User.email == form_data.username).first()

    if not db_user or not verify_password(form_data.password, db_user.password_hash):
=======
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
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
        raise HTTPException(status_code=401, detail="Email ou senha inválidos")

    access_token = create_access_token(data={"sub": db_user.email})

    return {
        "access_token": access_token,
<<<<<<< HEAD
        "token_type": "bearer",
        "user": UserResponse.model_validate(db_user),
    }
=======
        "token_type": "bearer"
    }
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
