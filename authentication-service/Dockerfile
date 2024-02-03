FROM node:16

# RUN apt-get update && \
#     apt-get install -y netcat && \
#     rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "app.js"]

# CMD ["./wait-for-kafka.sh", "kafka:9093", "node", "app.js"]