import axiosInstance from "../../Utils/Axios/baseUrl";
import { driverPrivate } from "../../Utils/Axios/driverInterceptor";
import { UserPrivate } from "../../Utils/Axios/userInterceptor";

export const searchNearByDriverService = async (
  userId,
  pickupLocation,
  dropoffLocation
) => {
  return UserPrivate.get(
    `trip/users/nearby-drivers?userId=${userId}&pickupLongitude=${pickupLocation[0]}&pickupLatitude=${pickupLocation[1]}&dropLongitude=${dropoffLocation[0]}&dropLatitude=${dropoffLocation[1]}`
  );
};

export const  requestRideService = async (data) => {
  return await UserPrivate.post("trip/users/request-ride", data);
};

export const acceptTripService = async(data)=>{
  const {tripId,driverId,status} = data

  return await driverPrivate.post('trip/driver/accept-ride',{tripId,driverId,status})
}

export const rejectTripService = async(data)=>{
  const {driverId,status,tripId} = data
  return await driverPrivate.post('trip/driver/reject-ride',{tripId,driverId,status})
}

export const startRideService = async(data)=>{
  return await driverPrivate.post('trip/driver/start-ride',data)
}

export const finishRideService = async(data)=>{
  return await driverPrivate.post('trip/driver/complete-ride',data)
}

export const sendMessageService = async(data)=>{
  return await axiosInstance.post('chat/sendMessage',data)
}

export const getMessageService = async(tripId)=>{
  try {
   const response =  await axiosInstance.get(`chat/messages/${tripId}`)
   console.log(response.data);
   return response.data
  } catch (error) {
    
  }
}

export const getAllTripsService =async(userId)=>{
  try {
    const response =await UserPrivate.get(`trip/users/trip-details/${userId}`)
    return response.data
  } catch (error) {
    console.error(error);
    
  }
}

export const getTripDetailService =async(tripId)=>{
  try {
    const response = await UserPrivate.get(`payment/user/trip-deatils/${tripId}`)
    return response.data
  } catch (error) {
    
  }
}

export const cancelRideService =async(rideCancelInfo)=>{
  return await UserPrivate.post('trip/users/cancel-ride',rideCancelInfo)
}

