from fastapi import APIRouter, Depends, HTTPException # <-- Adicionei o HTTPException aqui
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.patient import Patient
from app.models.user import User
from app.schemas.patient import PatientCreate, PatientResponse
from app.services.security import get_current_user

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_patient = Patient(**patient.dict(), user_id=current_user.id)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.get("/", response_model=list[PatientResponse])
def get_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Patient).filter(Patient.user_id == current_user.id).all()

# --- NOVA ROTA DE EXCLUSÃO AJUSTADA ---
@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Segurança: Só deleta se estiver logado
):
    # Buscamos o paciente garantindo que ele pertence ao usuário logado
    db_patient = db.query(Patient).filter(
        Patient.id == patient_id, 
        Patient.user_id == current_user.id
    ).first()

    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou acesso negado")
    
    db.delete(db_patient)
    db.commit()
    return {"message": "Paciente excluído com sucesso"}

# Adicione este import no topo se não tiver:
# from app.models.patient import Patient

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_detail(
    patient_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_patient = db.query(Patient).filter(
        Patient.id == patient_id, 
        Patient.user_id == current_user.id
    ).first()
    
    if not db_patient:
        raise HTTPException(status_code=404, detail="Paciente não encontrado")
    return db_patient