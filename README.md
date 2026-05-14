<<<<<<< HEAD
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
=======
# 🥗 NutriAI - Inteligência Artificial para Nutricionistas

NutriAI é uma plataforma Full-Stack de alta performance desenvolvida para nutricionistas. O sistema utiliza Inteligência Artificial para otimizar a criação de dietas, gerir pacientes e acompanhar a evolução clínica através de um dashboard estratégico.

O sistema permite desde o cadastro de pacientes até a exportação de planos alimentares em PDF profissional, garantindo agilidade no atendimento e precisão nos cálculos nutricionais.

## 🚀 Funcionalidades Implementadas

### 👨‍⚕️ Gestão de Pacientes (CRUD Completo)
- **Cadastro e Edição:** Controle total sobre os dados físicos e objetivos dos pacientes.
- **Listagem Dinâmica:** Filtros por nome, e-mail e objetivo (Emagrecimento, Hipertrofia, etc).
- **Área de Detalhes:** Perfil individual com resumo de indicadores (Peso, Altura, IMC) e histórico.
- **Anotações Clínicas:** Campo para registro de observações durante a consulta.

### 📊 Dashboard Estratégico (Figma Style)
- **KPIs em Tempo Real:** Cards com total de pacientes, dietas criadas e pacientes ativos.
- **Gráfico de Crescimento:** Visualização mensal de novos cadastros integrada ao banco de dados (Recharts).
- **Lista de Recentes:** Acesso rápido aos últimos pacientes atendidos.

### 🧠 Inteligência em Dietas
- **Cálculo Automático:** Geração instantânea de IMC e sugestão de metas calóricas.
- **Plano Alimentar IA:** Divisão organizada por refeições (Café, Lanches, Almoço, Jantar, Ceia).
- **Exportação Profissional:** Geração de PDF via client-side com layout personalizado para o paciente.

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **Framework:** Next.js (App Router)
- **Estilização:** TailwindCSS & Shadcn UI
- **Animações:** Framer Motion
- **Gráficos:** Recharts
- **PDF:** jsPDF & html2canvas
- **Ícones:** Lucide React

### Backend
- **API:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Banco de Dados:** PostgreSQL (DBeaver para gestão)
- **Segurança:** Autenticação JWT (Bearer Token) e Criptografia de senhas (Passlib)

---

## 🗄️ Banco de Dados

O NutriAI utiliza **PostgreSQL** com a seguinte estrutura principal:
- **Users:** Armazena os dados dos nutricionistas cadastrados.
- **Patients:** Registra informações físicas, metas e vínculo com o nutricionista.
- **Diets:** Guarda o histórico de planos alimentares, calorias totais e o `pdf_url` para referência de arquivos.
- **Meals/FoodItems:** Estrutura detalhada de alimentos por refeição.

---

## ⚙️ Como Rodar o Projeto

### 1. Requisitos Próximos
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL ativo

### 2. Configurando o Backend (Python)
bash
# Entre na pasta do backend
cd backend_nutriai/nutriAI

# Crie um ambiente virtual
python -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
uvicorn app.main:app --reload

### 3. Configurando o Frontend

# Entre na pasta do frontend
cd nutriAI

# Instale as dependências
npm install

# Instale a biblioteca de gráficos (caso ainda não tenha)
npm install recharts jspdf html2canvas

# Inicie o projeto
npm run dev

### Como rodar com Docker
# Instale o docker
docker-compose up --build
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
