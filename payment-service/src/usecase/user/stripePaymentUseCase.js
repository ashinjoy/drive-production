import { creatStripSession } from "../../utils/stripeSession.js";
import { WalletRecordUpates } from "../../helpers/walletRecordUpdate.js";
import { KafkaClient } from "../../../../trip-service/src/events/KafkaClient.js";
import { PAYMENT_COMPLETED,PAYMENT_TOPIC } from "../../../../trip-service/src/events/config.js";


export class StripePaymentUseCase {
  constructor(dependencies) {
    this.paymentRepository =new dependencies.repository.MongoPaymentRepository();
    this.userRepository = new dependencies.repository.MongoUserRepository();
    this.tripRepository = new dependencies.repository.MongoTripRepository();
    this.walletUpdates = new WalletRecordUpates()
    this.kafka = new KafkaClient()
    
  }
  async execute(data) {
    try {
      const { userId, tripId, paymentMethod, fare, driverId } = data;
      const [userDetails, tripDetails] = await Promise.all([this.userRepository.findUserById(userId),this.tripRepository.findTripById(tripId)]);
      const stripeSession = await creatStripSession(
        userDetails?.email,
        tripId,
        tripDetails?.pickUpLocation,
        tripDetails?.dropOffLocation,
        fare
      );
      const payment = await this.paymentRepository.findTripAndUpdate(tripId,{fare,paymentStatus: "paid"});
      await this.walletUpdates.UpdateWallets(fare, driverId, tripId,paymentMethod);    
      this.kafka.produceMessage(PAYMENT_TOPIC,{
        type:PAYMENT_COMPLETED,
        value:JSON.stringify({...payment,driverId})
      })
      return {stripeSession,payment};
    } catch (error) {
      console.error(error);
      throw error
    }
  }
}
