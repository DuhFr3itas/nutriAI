from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.patient import Patient
from app.models.user import User
from app.schemas.ai import AIDietRequest, AIDietResponse
from app.services.security import get_current_user
from app.services.nutrition_ai import generate_and_save_diet, normalize_goal

router = APIRouter(prefix="/ai", tags=["Inteligência Artificial"])


@router.post("/generate-diet", response_model=AIDietResponse, status_code=status.HTTP_201_CREATED)
def generate_diet_with_ai(
    payload: AIDietRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    patient = db.query(Patient).filter(
        Patient.id == payload.patient_id,
        Patient.user_id == current_user.id,
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou acesso negado")

    diet, target, warnings = generate_and_save_diet(db, patient, payload)

    strategy_by_goal = {
        "emagrecimento": "A IA priorizou alimentos com boa saciedade, proteínas magras, fibras e controle calórico.",
        "hipertrofia": "A IA priorizou proteínas, carboidratos distribuídos ao longo do dia e maior densidade energética.",
        "manutencao": "A IA buscou equilíbrio entre proteínas, carboidratos, gorduras boas e vegetais.",
    }

    return AIDietResponse(
        diet=diet,
        target_calories=target,
        estimated_calories=diet.total_calories,
        strategy=strategy_by_goal[normalize_goal(patient.goal)],
        warnings=warnings,
    )
