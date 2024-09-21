import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  searchNearByDriverService,
  requestRideService,
  acceptTripService,
  rejectTripService,
  startRideService,
  finishRideService,
  sendMessageService,
  cancelRideService
} from "./tripService";
import { UserPrivate } from "../../Utils/Axios/userInterceptor";
import { paymentService } from "../User/userService";

export const seacrhNearByDriver = createAsyncThunk(
  "searchNearByDrivers",
  async (details, { rejectWithValue }) => {
    try {
      const { userId, pickupLocation, dropoffLocation } = details;
      const response = await searchNearByDriverService(
        userId,
        pickupLocation,
        dropoffLocation
      );
      return response.data;
    } catch (error) {
      rejectWithValue(error?.response?.data?.error)
    }
  }
);

export const requestRideAction = createAsyncThunk(
  "requestRide",
  async (data, { rejectWithValue }) => {
    try {
      const response = await requestRideService(data);
      return response.data;
    } catch (error) {
      console.log(error);
      rejectWithValue(error);
    }
  }
);

export const acceptTrip = createAsyncThunk(
  "acceptTrip",
  async (details, { rejectWithValue }) => {
    try {
      const response = await acceptTripService(details);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
)

export const rejectTrip = createAsyncThunk(
    "acceptTrip",
    async (details, { rejectWithValue }) => {
      try {
        const response = await rejectTripService(details);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    }
  );

  export const startTrip = createAsyncThunk('startRide',async(data)=>{
    try {
    const response =   await startRideService(data)
    return response.data
    } catch (error) {
     console.error(error) 
    }
  })

  export const finishRide = createAsyncThunk('finishRide',async(data)=>{
    try {
      const response = await finishRideService(data)
      return response.data
    } catch (error) {
      console.error(error);
    }
  })

  export const sendMessage = createAsyncThunk('sendMessage',async(data)=>{
    try {
      const response = await sendMessageService(data)
      return response.data
    } catch (error) {
      console.error(error)
    }
  })

  export const cancelRide =createAsyncThunk('cancelRide',async(rideCancelInfo)=>{
    try {
      const response = await cancelRideService(rideCancelInfo)
      return response.data
    } catch (error) {
      
    }
  })

  export const payment =createAsyncThunk('payment',async(paymentData)=>{
    try {
      const response = await paymentService(paymentData)
      console.log('response in payment',response);
      
      if(response.payment.url){
        window.location.href = response.payment.url
      }
      return response.data
    } catch (error) {
      
    }
  })

