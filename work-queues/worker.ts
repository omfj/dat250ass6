// @ts-types="@types/amqplib"
import * as amqp from "amqplib";

const queue = "task_queue";

const connection = await amqp.connect({
  hostname: "localhost",
  username: "user",
  password: "password",
});

const channel = await connection.createChannel();

await channel.assertQueue(queue, { durable: true });
await channel.prefetch(1);

console.log(`Waiting for messages in ${queue}`);

channel.consume(
  queue,
  (msg) => {
    if (!msg) {
      return;
    }

    const secs = msg.content.toString().split(".").length - 1;

    console.log(`Received ${msg.content.toString()}`);

    setTimeout(() => {
      console.log("Done");
      channel.ack(msg);
    }, secs * 1000);
  },
  {
    noAck: false,
  }
);
