FROM node:18-alpine

WORKDIR /frontend

# Copia arquivos de pacotes
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código do Next.js
COPY . .

EXPOSE 3000

# Roda o Next.js
CMD ["npm", "run", "dev"]