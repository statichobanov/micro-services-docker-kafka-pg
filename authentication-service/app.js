const express = require("express");

const { Kafka } = require("kafkajs");

const app = express();
const port = 3001;
let producer;
// ... Other authentication logic ...

const kafka = new Kafka({
  clientId: "authentication-service",
  brokers: ["kafka:9092"],
});

producer = kafka.producer();

console.log("Produceer connected");
app.post("/authentication/login", async (req, res) => {
  console.log("Login route hit");

  await producer.send({
    topic: "user-events",
    messages: [
      {
        value: JSON.stringify({
          eventType: "UserLoggedIn",
          userId: "user.id",
          username: "user.username",
        }),
      },
    ],
  });

  res.status(200).json({ message: "Login successful" });
});

app.listen(port, () => {
  console.log(`Authentication Service listening at http://localhost:${port}`);
});

producer
  .connect()
  .then(() => console.log("Producer connected"))
  .catch((error) => console.error("Producer connection error:", error));
