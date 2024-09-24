import { Kafka } from "kafkajs";
export class KafkaClient {
  constructor() {
    this.kafka = new Kafka({
      clientId: "auth-service",
      brokers: [
        "kafka-0.kafka-headless.kafka.svc.cluster.local:9092",
        "kafka-1.kafka-headless.kafka.svc.cluster.local:9092",
        "kafka-2.kafka-headless.kafka.svc.cluster.local:9092"
      ],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "auth-service" });
  }
  async produceMessage(topic,messages) {
    try {
      console.log(topic);
      await this.producer.connect();
      await this.producer.send({
        topic: topic,
        messages: [
            {
                value: JSON.stringify(messages)
            }
        ],
      });
      await this.producer.disconnect()
    } catch (error) {
      console.error(error);
    }
  }

  async consumeMessages(topic){
    try {
        await consumer.connect()
        await consumer.subscribe({ topic: topic, fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
              console.log({
                value: message.value.toString()
              })
            },
          })
    } catch (error) {
        console.error(error);
        
    }

  }
}
