// @ts-types="@types/amqplib"
import * as amqp from "amqplib";

const args = Deno.args;

if (args.length === 0) {
  console.log("Usage: topics/recieve.ts <facility>.<severity>");
  Deno.exit(1);
}

const connection = await amqp.connect({
  hostname: "localhost",
  username: "user",
  password: "password",
});

const channel = await connection.createChannel();
const exchange = "topic_logs";

await channel.assertExchange(exchange, "topic", {
  durable: false,
});

const queue = await channel.assertQueue("", {
  exclusive: true,
});

for (const key of args) {
  await channel.bindQueue(queue.queue, exchange, key);
}

console.log(`Waiting for logs, on ${args.join(", ")}`);

channel.consume(
  queue.queue,
  (msg) => {
    console.log(`${msg?.fields.routingKey}: ${msg?.content.toString()}`);
  },
  {
    noAck: true,
  }
);
