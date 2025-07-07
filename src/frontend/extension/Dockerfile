FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG MODE=prod

# Build en prod uniquement
RUN if [ "$MODE" = "prod" ]; then npm run build; fi

# CMD conditionnel selon le mode
CMD sh -c "if [ \"$MODE\" = \"dev\" ]; then npm start; else sh; fi"