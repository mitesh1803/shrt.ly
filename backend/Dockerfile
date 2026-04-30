FROM node:22-alpine

WORKDIR /app

COPY package* .
RUN npm install

COPY ./prisma .
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["nodemon","--exec","tsx", "src/server.js"]