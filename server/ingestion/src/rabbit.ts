import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE = process.env.RABBITMQ_QUEUE || "ingestion.documents";

export async function publishDocument(doc: any) {
  const conn = await amqp.connect(RABBITMQ_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue(QUEUE, { durable: true });
  ch.sendToQueue(QUEUE, Buffer.from(JSON.stringify(doc)), { persistent: true });
  await ch.close();
  await conn.close();
}
