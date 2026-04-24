from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# 1. Importar as rotas novas
from app.routes import user, patient 
# 2. Importar o banco e os modelos para gerar as tabelas
from app.database.connection import engine, Base
from app.models import user as user_model, patient as patient_model
# FORÇANDO o Python a ler as tabelas de dieta antes de criar o banco:
from app.models.diet import Diet, Meal, FoodItem
from app.routes import user, patient, diet

# 3. Isso garante que as tabelas serão criadas no PostgreSQL
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(patient.router) # 4. Registrar a rota de pacientes
app.include_router(user.router)
app.include_router(patient.router)
app.include_router(diet.router)

@app.get("/")
def read_root():
    return {"message": "API NutriAI rodando 🚀"}