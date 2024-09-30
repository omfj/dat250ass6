// @ts-types="@types/amqplib"
import * as amqp from "amqplib";
import { Buffer } from "node:buffer";

const connection = await amqp.connect({
  hostname: "localhost",
  username: "user",
  password: "password",
});

const exchange = "topic_logs";
const args = Deno.args;
const key = args.length > 0 ? args[0] : "anonymous.info";
const msg = args.slice(1).join(" ") || "Hello World!";

const channel = await connection.createChannel();

await channel.assertExchange(exchange, "topic", {
  durable: false,
});

channel.publish(exchange, key, Buffer.from(msg));

console.log(`Sent ${msg} to ${key}`);

await connection.close();

Deno.exit(0);
