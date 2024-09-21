export class GetTripDetailByIdUseCase{
    constructor(dependencies){
    this.tripRepository = new dependencies.repository.MongoTripRepository()
    }
    async execute(id){
        try {
          const getTripById =   await this.tripRepository.findTripById(id)
          return getTripById

        } catch (error) {
            console.error(error);
            
        }
    }
}