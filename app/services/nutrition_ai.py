from __future__ import annotations

import math
import re
import unicodedata
from dataclasses import dataclass
from typing import Iterable

from sqlalchemy.orm import Session

from app.database.connection import SessionLocal
from app.models.diet import Diet, FoodItem, Meal
from app.models.nutrition import NutritionFood
from app.models.patient import Patient


SEED_FOODS = [
    {"name": "Aveia em flocos", "group": "carboidrato", "portion": "40 g", "calories": 150, "protein_g": 5, "carbs_g": 27, "fat_g": 3, "fiber_g": 4, "meal_tags": "cafe,lanche,ceia", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose"},
    {"name": "Banana", "group": "fruta", "portion": "1 unidade média", "calories": 90, "protein_g": 1, "carbs_g": 23, "fat_g": 0, "fiber_g": 2.6, "meal_tags": "cafe,lanche,pre_treino", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Maçã", "group": "fruta", "portion": "1 unidade média", "calories": 80, "protein_g": 0, "carbs_g": 21, "fat_g": 0, "fiber_g": 3.5, "meal_tags": "lanche,ceia", "goal_tags": "emagrecimento,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Mamão", "group": "fruta", "portion": "1 fatia média", "calories": 65, "protein_g": 1, "carbs_g": 16, "fat_g": 0, "fiber_g": 2, "meal_tags": "cafe,lanche", "goal_tags": "emagrecimento,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Ovo cozido", "group": "proteina", "portion": "2 unidades", "calories": 140, "protein_g": 12, "carbs_g": 1, "fat_g": 10, "fiber_g": 0, "meal_tags": "cafe,lanche,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,sem_lactose,sem_gluten"},
    {"name": "Iogurte natural", "group": "proteina", "portion": "170 g", "calories": 110, "protein_g": 8, "carbs_g": 11, "fat_g": 4, "fiber_g": 0, "meal_tags": "cafe,lanche,ceia", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,sem_gluten"},
    {"name": "Iogurte vegetal", "group": "proteina", "portion": "170 g", "calories": 120, "protein_g": 4, "carbs_g": 18, "fat_g": 4, "fiber_g": 1, "meal_tags": "cafe,lanche,ceia", "goal_tags": "emagrecimento,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Pão integral", "group": "carboidrato", "portion": "2 fatias", "calories": 140, "protein_g": 6, "carbs_g": 24, "fat_g": 2, "fiber_g": 4, "meal_tags": "cafe,lanche", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose"},
    {"name": "Tapioca", "group": "carboidrato", "portion": "2 colheres de sopa", "calories": 130, "protein_g": 0, "carbs_g": 32, "fat_g": 0, "fiber_g": 0, "meal_tags": "cafe,lanche", "goal_tags": "hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Arroz integral", "group": "carboidrato", "portion": "4 colheres de sopa", "calories": 150, "protein_g": 3, "carbs_g": 32, "fat_g": 1, "fiber_g": 2, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Batata doce", "group": "carboidrato", "portion": "120 g", "calories": 115, "protein_g": 2, "carbs_g": 27, "fat_g": 0, "fiber_g": 3, "meal_tags": "almoco,jantar,pre_treino", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Feijão carioca", "group": "leguminosa", "portion": "1 concha média", "calories": 110, "protein_g": 7, "carbs_g": 19, "fat_g": 1, "fiber_g": 6, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Grão de bico", "group": "leguminosa", "portion": "4 colheres de sopa", "calories": 135, "protein_g": 7, "carbs_g": 22, "fat_g": 2, "fiber_g": 6, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Peito de frango grelhado", "group": "proteina", "portion": "120 g", "calories": 195, "protein_g": 36, "carbs_g": 0, "fat_g": 4, "fiber_g": 0, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "sem_lactose,sem_gluten"},
    {"name": "Patinho moído", "group": "proteina", "portion": "100 g", "calories": 210, "protein_g": 28, "carbs_g": 0, "fat_g": 10, "fiber_g": 0, "meal_tags": "almoco,jantar", "goal_tags": "hipertrofia,manutencao", "restriction_tags": "sem_lactose,sem_gluten"},
    {"name": "Tilápia grelhada", "group": "proteina", "portion": "120 g", "calories": 155, "protein_g": 32, "carbs_g": 0, "fat_g": 3, "fiber_g": 0, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "sem_lactose,sem_gluten"},
    {"name": "Tofu grelhado", "group": "proteina", "portion": "120 g", "calories": 145, "protein_g": 15, "carbs_g": 4, "fat_g": 8, "fiber_g": 2, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Salada verde", "group": "vegetal", "portion": "1 prato de sobremesa", "calories": 35, "protein_g": 2, "carbs_g": 6, "fat_g": 0, "fiber_g": 3, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Brócolis cozido", "group": "vegetal", "portion": "1 xícara", "calories": 55, "protein_g": 4, "carbs_g": 11, "fat_g": 0, "fiber_g": 5, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Abacate", "group": "gordura", "portion": "3 colheres de sopa", "calories": 120, "protein_g": 1, "carbs_g": 6, "fat_g": 11, "fiber_g": 5, "meal_tags": "lanche,ceia", "goal_tags": "hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Azeite de oliva", "group": "gordura", "portion": "1 colher de sopa", "calories": 90, "protein_g": 0, "carbs_g": 0, "fat_g": 10, "fiber_g": 0, "meal_tags": "almoco,jantar", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Castanhas", "group": "gordura", "portion": "20 g", "calories": 120, "protein_g": 4, "carbs_g": 5, "fat_g": 10, "fiber_g": 2, "meal_tags": "lanche,ceia", "goal_tags": "hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
    {"name": "Whey protein", "group": "proteina", "portion": "30 g", "calories": 120, "protein_g": 24, "carbs_g": 3, "fat_g": 2, "fiber_g": 0, "meal_tags": "lanche,ceia,pos_treino", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "sem_gluten"},
    {"name": "Proteína vegetal", "group": "proteina", "portion": "30 g", "calories": 115, "protein_g": 22, "carbs_g": 3, "fat_g": 2, "fiber_g": 1, "meal_tags": "lanche,ceia,pos_treino", "goal_tags": "emagrecimento,hipertrofia,manutencao", "restriction_tags": "vegetariano,vegano,sem_lactose,sem_gluten"},
]

MEAL_TEMPLATES = [
    ("Café da Manhã", "07:00", "cafe", ["carboidrato", "proteina", "fruta"]),
    ("Lanche da Manhã", "10:00", "lanche", ["fruta", "proteina"]),
    ("Almoço", "12:30", "almoco", ["carboidrato", "proteina", "leguminosa", "vegetal"]),
    ("Lanche da Tarde", "16:00", "lanche", ["carboidrato", "proteina", "fruta"]),
    ("Jantar", "19:30", "jantar", ["carboidrato", "proteina", "vegetal"]),
    ("Ceia", "22:00", "ceia", ["proteina", "fruta"]),
]


def normalize_text(value: str | None) -> str:
    """Normaliza texto livre para a IA entender observações como 'não come fruta'."""
    value = (value or "").lower()
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    return value


FOOD_CATEGORY_TERMS = {
    "fruta": {"fruta", "frutas", "banana", "maca", "maçã", "mamao", "mamão", "abacate", "uva", "pera", "laranja", "morango", "melancia", "melao"},
    "vegetal": {"verdura", "verduras", "legume", "legumes", "salada", "brocolis", "brócolis", "vegetal", "vegetais"},
    "lactose": {"lactose", "leite", "iogurte", "queijo", "whey"},
    "gluten": {"gluten", "glúten", "pao", "pão", "trigo", "aveia"},
    "carne": {"carne", "frango", "peixe", "patinho", "tilapia", "tilápia"},
    "ovo": {"ovo", "ovos"},
    "amendoim": {"amendoim", "castanhas", "castanha"},
}


def expand_restriction_terms(terms: set[str]) -> set[str]:
    expanded = set()
    normalized_terms = {normalize_text(term).strip() for term in terms if term and term.strip()}
    for term in normalized_terms:
        expanded.add(term)
        for category, synonyms in FOOD_CATEGORY_TERMS.items():
            normalized_synonyms = {normalize_text(item) for item in synonyms}
            if term == category or term in normalized_synonyms or category in term:
                expanded.add(category)
                expanded.update(normalized_synonyms)
    return {term for term in expanded if len(term) >= 3}


def extract_blocked_terms_from_notes(notes: str | None) -> set[str]:
    """Extrai alimentos/grupos proibidos de frases livres do nutricionista."""
    text = normalize_text(notes)
    if not text:
        return set()

    terms = set()

    # Captura listas simples digitadas pelo nutricionista, como:
    # "não come fruta", "sem banana, maçã e mamão", "alergia a amendoim".
    for pattern in [
        r"(?:sem|evitar|excluir|retirar)\s+([^.;\n]+)",
        r"(?:nao|não)\s+(?:come|consome|gosta|aceita|pode comer)\s+(?:de\s+)?([^.;\n]+)",
        r"(?:alergia|intolerancia)\s+(?:a|ao|à|de)?\s*([^.;\n]+)",
    ]:
        for match in re.finditer(pattern, text):
            fragment = match.group(1)
            for term in re.split(r",|;|\n| e | ou |/", fragment):
                term = term.strip()
                if len(term) >= 3:
                    terms.add(term)

    return expand_restriction_terms(terms)


@dataclass
class RestrictionProfile:
    blocked_tags: set[str]
    required_tags: set[str]
    raw_terms: set[str]


def seed_nutrition_database() -> None:
    db = SessionLocal()
    try:
        if db.query(NutritionFood).count() > 0:
            return
        db.add_all([NutritionFood(**food) for food in SEED_FOODS])
        db.commit()
    finally:
        db.close()


def normalize_goal(goal: str | None) -> str:
    text = (goal or "").lower()
    if any(term in text for term in ["emag", "perder", "cut", "defini"]):
        return "emagrecimento"
    if any(term in text for term in ["hipert", "ganhar", "massa", "bulking"]):
        return "hipertrofia"
    return "manutencao"


def calculate_target_calories(patient: Patient, activity_level: str, manual_target: int | None = None) -> int:
    if manual_target:
        return manual_target

    weight = float(patient.weight or 70)
    height = float(patient.height or 170)
    age = int(patient.age or 30)

    if height < 3:
        height *= 100

    base = (10 * weight) + (6.25 * height) - (5 * age)
    base += 5

    factors = {
        "sedentario": 1.2,
        "leve": 1.375,
        "moderado": 1.55,
        "ativo": 1.725,
    }
    calories = base * factors.get(activity_level, 1.55)

    goal = normalize_goal(patient.goal)
    if goal == "emagrecimento":
        calories *= 0.82
    elif goal == "hipertrofia":
        calories *= 1.10

    return int(round(calories / 50) * 50)


def build_restriction_profile(flags, other_restrictions: str | None, professional_notes: str | None = None) -> RestrictionProfile:
    blocked = set()
    required = set()

    if getattr(flags, "lactose", False):
        blocked.update({"lactose", "leite", "iogurte", "queijo", "whey"})
        required.add("sem_lactose")
    if getattr(flags, "gluten", False):
        blocked.update({"gluten", "pao", "pão", "trigo"})
        required.add("sem_gluten")
    if getattr(flags, "amendoim", False):
        blocked.update({"amendoim", "castanha", "castanhas"})
    if getattr(flags, "vegetariano", False):
        required.add("vegetariano")
        blocked.update({"carne", "frango", "peixe", "patinho", "tilapia", "tilápia"})
    if getattr(flags, "vegano", False):
        required.add("vegano")
        required.add("vegetariano")
        blocked.update({"carne", "frango", "peixe", "ovo", "leite", "iogurte", "whey", "queijo"})

    notes = "\n".join(part for part in [other_restrictions or "", professional_notes or ""] if part)

    raw_terms = {
        normalize_text(term).strip()
        for term in re.split(r"[,;\n]", notes)
        if len(term.strip()) >= 3
    }

    extracted_terms = extract_blocked_terms_from_notes(notes)
    raw_terms.update(extracted_terms)
    blocked.update(expand_restriction_terms(raw_terms))

    return RestrictionProfile(blocked_tags=blocked, required_tags=required, raw_terms=raw_terms)


def food_matches(food: NutritionFood, meal_tag: str, goal: str, profile: RestrictionProfile) -> bool:
    text = normalize_text(f"{food.name} {food.group} {food.restriction_tags} {food.notes or ''}")
    tags = {normalize_text(tag).strip() for tag in (food.restriction_tags or "").split(",")}
    meal_tags = {normalize_text(tag).strip() for tag in (food.meal_tags or "").split(",")}
    goal_tags = {normalize_text(tag).strip() for tag in (food.goal_tags or "").split(",")}

    if meal_tag not in meal_tags:
        return False
    if goal not in goal_tags and "manutencao" not in goal_tags:
        return False
    if any(blocked in text for blocked in profile.blocked_tags):
        return False
    if not profile.required_tags.issubset(tags):
        return False
    return True


def pick_foods(candidates: Iterable[NutritionFood], groups: list[str], calories_for_meal: int) -> list[NutritionFood]:
    selected: list[NutritionFood] = []
    used_ids = set()
    candidates = list(candidates)

    for group in groups:
        group_options = [food for food in candidates if food.group == group and food.id not in used_ids]
        if not group_options:
            continue
        current = sum(food.calories for food in selected)
        remaining = max(calories_for_meal - current, 0)
        chosen = min(group_options, key=lambda food: abs(food.calories - max(remaining / 2, 80)))
        selected.append(chosen)
        used_ids.add(chosen.id)

    if not selected and candidates:
        selected.append(min(candidates, key=lambda food: abs(food.calories - calories_for_meal)))

    return selected


def generate_and_save_diet(db: Session, patient: Patient, request) -> tuple[Diet, int, list[str]]:
    target = calculate_target_calories(patient, request.activity_level, request.calorie_target)
    goal = normalize_goal(patient.goal)
    profile = build_restriction_profile(request.restrictions, request.other_restrictions, request.professional_notes)
    warnings: list[str] = []

    templates = MEAL_TEMPLATES[: request.meals_per_day]
    weights = [0.22, 0.10, 0.28, 0.13, 0.22, 0.05][: len(templates)]
    weight_sum = sum(weights)
    weights = [weight / weight_sum for weight in weights]

    db_diet = Diet(patient_id=patient.id, total_calories=0)
    db.add(db_diet)
    db.flush()

    total = 0
    foods = db.query(NutritionFood).filter(NutritionFood.active.is_(True)).all()

    for index, (title, time, meal_tag, groups) in enumerate(templates):
        meal_target = int(target * weights[index])
        candidates = [food for food in foods if food_matches(food, meal_tag, goal, profile)]
        chosen_foods = pick_foods(candidates, groups, meal_target)

        if not chosen_foods:
            warnings.append(f"Não foram encontrados alimentos compatíveis para {title}.")
            continue

        meal_total = sum(food.calories for food in chosen_foods)
        total += meal_total
        db_meal = Meal(diet_id=db_diet.id, title=title, time=time, total_calories=meal_total)
        db.add(db_meal)
        db.flush()

        for food in chosen_foods:
            db.add(
                FoodItem(
                    meal_id=db_meal.id,
                    name=food.name,
                    quantity=food.portion,
                    calories=food.calories,
                )
            )

    db_diet.total_calories = total
    db.commit()
    db.refresh(db_diet)

    if profile.raw_terms:
        warnings.append("Restrições aplicadas: " + ", ".join(sorted(profile.raw_terms)))

    if total < target * 0.70:
        warnings.append("A base nutricional disponível gerou uma dieta abaixo da meta. Cadastre mais alimentos compatíveis para melhorar a sugestão.")

    return db_diet, target, warnings
