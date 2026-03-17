FROM node:20-slim

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Port 7860 is standard for Hugging Face
EXPOSE 7860
ENV PORT=7860

CMD ["npm", "start"]
