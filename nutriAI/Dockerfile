<<<<<<< HEAD
FROM node:20-alpine

WORKDIR /frontend

COPY package*.json ./
RUN npm install

=======
FROM node:18-alpine

WORKDIR /frontend

# Copia arquivos de pacotes
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código do Next.js
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
COPY . .

EXPOSE 3000

<<<<<<< HEAD
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
=======
# Roda o Next.js
CMD ["npm", "run", "dev"]
>>>>>>> 41cd1c6abc1bbc936acca7085f16d7be5ebed42f
