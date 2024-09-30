// @ts-types="@types/amqplib"
import * as amqp from "amqplib";
import { Buffer } from "node:buffer";

const connection = await amqp.connect({
  hostname: "localhost",
  username: "user",
  password: "password",
});

const channel = await connection.createChannel();

const queue = "hello";
const message = "Hello World!";

await channel.assertQueue(queue, {
  durable: false,
});

channel.sendToQueue(queue, Buffer.from(message));

console.log(`Sent ${message} to ${queue}`);

await channel.close();
await connection.close();

Deno.exit(0);
