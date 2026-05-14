# NutriAI

Sistema web para nutricionistas com login, cadastro de pacientes, base nutricional e geração de dietas com uma IA baseada em regras nutricionais.

## O que está funcionando

- Frontend em Next.js na porta 3000
- Backend em FastAPI na porta 8000
- Banco PostgreSQL em Docker
- Cadastro e login de nutricionista com token JWT
- Cadastro, listagem, edição e exclusão de pacientes
- Base nutricional com alimentos, macros, tags de refeição, objetivo e restrição
- IA integrada ao backend para gerar dieta a partir dos dados do paciente e das informações inseridas pelo nutricionista
- Salvamento da dieta gerada no banco de dados

## Como rodar

Na pasta raiz do projeto, execute:

```bash
docker compose down --remove-orphans
docker compose up -d --build
```

Depois acesse:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8000/docs
```

## Fluxo de teste recomendado

1. Acesse `http://localhost:3000`
2. Crie uma conta de nutricionista
3. Faça login
4. Cadastre um paciente
5. Acesse `Base Nutricional` e confira ou cadastre alimentos
6. Acesse `Criar Dieta`
7. Selecione o paciente, informe atividade e restrições
8. Clique em gerar dieta com IA

## Comandos úteis

Ver containers:

```bash
docker compose ps
```

Ver logs do backend:

```bash
docker compose logs --tail=120 backend
```

Ver logs do frontend:

```bash
docker compose logs --tail=120 frontend
```

Resetar banco de dados:

```bash
docker compose down -v
docker compose up -d --build
```

## Como a IA funciona

A IA deste projeto não utiliza OpenAI, Gemini ou outro modelo externo. Ela é uma IA local baseada em regras nutricionais, filtros e cálculos. O código principal fica em `app/services/nutrition_ai.py`.

Ela usa:

1. Dados do paciente cadastrados pelo nutricionista
2. Objetivo do paciente
3. Nível de atividade informado na tela de criação de dieta
4. Restrições alimentares informadas pelo nutricionista
5. Base nutricional salva na tabela `nutrition_foods`
6. Alimentos iniciais cadastrados automaticamente em `SEED_FOODS`, dentro de `app/services/nutrition_ai.py`

O sistema calcula uma meta calórica estimada, filtra alimentos compatíveis com objetivo, refeição e restrições, monta refeições e salva a dieta no banco.

## PDF da dieta

A tela `dashboard/gerar-pdf` carrega o paciente e a dieta mais recente. O botão de PDF usa o recurso de impressão do navegador. Para salvar como PDF, escolha a opção `Salvar como PDF` na janela de impressão.
