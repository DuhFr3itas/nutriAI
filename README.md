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