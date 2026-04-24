from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Ajuste este import dependendo de onde fica o seu get_db (pode ser app.database.dependencies ou app.database.connection)
from app.database.connection import get_db 
from app.models.diet import Diet, Meal, FoodItem
from app.schemas.diet import DietCreate, Diet as DietSchema

router = APIRouter(
    prefix="/diets",
    tags=["Dietas"]
)

@router.post("/", response_model=DietSchema, status_code=status.HTTP_201_CREATED)
def create_diet(diet: DietCreate, db: Session = Depends(get_db)):
    """Salva uma dieta inteira no banco (com refeições e alimentos) de uma vez só."""
    # 1. Cria a Dieta "Pai"
    db_diet = Diet(patient_id=diet.patient_id, total_calories=diet.total_calories)
    db.add(db_diet)
    db.commit()
    db.refresh(db_diet)

    # 2. Cria as Refeições e os Alimentos amarrados nessa Dieta
    for meal_data in diet.meals:
        db_meal = Meal(
            diet_id=db_diet.id,
            title=meal_data.title,
            time=meal_data.time,
            total_calories=meal_data.total_calories
        )
        db.add(db_meal)
        db.commit()
        db.refresh(db_meal)

        for food_data in meal_data.foods:
            db_food = FoodItem(
                meal_id=db_meal.id,
                name=food_data.name,
                quantity=food_data.quantity,
                calories=food_data.calories
            )
            db.add(db_food)
        db.commit() # Salva todos os alimentos daquela refeição

    db.refresh(db_diet) # Atualiza a dieta com tudo que foi pendurado nela
    return db_diet

@router.get("/patient/{patient_id}", response_model=List[DietSchema])
def get_diets_by_patient(patient_id: int, db: Session = Depends(get_db)):
    """Busca todas as dietas de um paciente específico (útil para o Histórico e para o PDF)."""
    diets = db.query(Diet).filter(Diet.patient_id == patient_id).all()
    return diets

@router.post("/save-pdf")
def save_diet_pdf(diet_data: DietCreate, db: Session = Depends(get_db)):
    # Aqui você salvaria o arquivo no disco ou em um S3/Cloudinary
    # E guardaria a URL no banco de dados
    new_diet = Diet(**diet_data.dict())
    db.add(new_diet)
    db.commit()
    return {"message": "PDF salvo com sucesso"}

@router.get("/patient/{patient_id}")
def get_diets_by_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(Diet).filter(Diet.patient_id == patient_id).all()