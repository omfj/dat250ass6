// @ts-types="@types/amqplib"
import * as amqp from "amqplib";

const connection = await amqp.connect({
  hostname: "localhost",
  username: "user",
  password: "password",
});

const channel = await connection.createChannel();

const queue = "hello";

channel.assertQueue(queue, {
  durable: false,
});

console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

channel.consume(
  queue,
  (msg) => {
    console.log(" [x] Received %s", msg?.content.toString());
  },
  {
    noAck: true,
  }
);
