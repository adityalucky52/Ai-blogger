FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Accept API URL as build argument
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
