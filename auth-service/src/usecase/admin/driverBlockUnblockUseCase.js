import { KafkaClient } from "../../events/KafkaClient.js";
import { TOPIC,DRIVER_UPDATED } from "../../events/config.js";

export class DriverBlockUnblockUseCase {
  constructor(dependencies) {
    this.driverRepository = new dependencies.repository.MongoDriverRepository();
    this.kafka = new KafkaClient()
  }
  async execute(driverId) {
    const getDriver = await this.driverRepository.findDriverbyId(driverId);
    console.log(getDriver);
    if (getDriver) {
      console.log(!getDriver.isBlocked)
      const updateDriver = await this.driverRepository.getDriverByIdAndUpdate(
        driverId,
        {isBlocked:!getDriver.isBlocked}
      );
      const dataToPublish ={
        _id:updateDriver._id,
        isBlocked:updateDriver.isBlocked
      }
      this.kafka.produceMessage(TOPIC,{
        type:DRIVER_UPDATED,
        value:JSON.stringify(dataToPublish)
      })
      return updateDriver
    } else {
    }
  }
}
