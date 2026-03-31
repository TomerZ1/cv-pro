FROM node:20-slim

WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json .
RUN npm install

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
