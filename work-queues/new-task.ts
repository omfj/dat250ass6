// @ts-types="@types/amqplib"
import * as amqp from "amqplib";
import { Buffer } from "node:buffer";

const queue = "task_queue";
const msg = Deno.args.join(" ") || "Hello World!";

const connection = await amqp.connect({
  hostname: "localhost",
  username: "user",
  password: "password",
});

const channel = await connection.createChannel();

await channel.assertQueue(queue, { durable: true });

channel.sendToQueue(queue, Buffer.from(msg), {
  persistent: true,
});

console.log(`Sent ${msg} to ${queue}`);

await channel.close();
await connection.close();

Deno.exit(0);
