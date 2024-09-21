import { createSlice } from "@reduxjs/toolkit";
import { seacrhNearByDriver,requestRideAction,acceptTrip,startTrip,finishRide,cancelRide, payment } from "./tripActions";

const trip = JSON.parse(localStorage.getItem('tripDetail'))
const tripStatus =localStorage.getItem('tripStatus')
const paymentStatus =localStorage.getItem('paymentStatus')
const initialState = {
    tripDetail:trip || null,
    nearbyDrivers:null,
    tripStatus:tripStatus||null,
    additionalSearchMetaData:'',
    paymentStatus:paymentStatus||null,
    loading:false,
    success:false,
    message:'',
    error:'' 
}
const tripSlice = createSlice({
    name:'tripSlice',
    initialState,
    reducers:{
        setTripData:(state,action)=>{
            console.log('action',action);
            localStorage.setItem('tripDetail',JSON.stringify(action?.payload))
            state.tripDetail = action?.payload
            state.tripStatus = "accepted"
        },
        setTripStatus:(state,action)=>{
            localStorage.setItem('tripStatus','started')
        state.tripStatus ="started"
        },
        resetTripDetails:(state,action)=>{
            localStorage.removeItem('tripDetail')
            localStorage.removeItem('tripStatus')
            localStorage.removeItem('paymentStatus')
            state.tripDetail = null
            state.tripStatus = null
        }
    },
    extraReducers(builder){
        builder.addCase(seacrhNearByDriver.pending,(state)=>{
            state.loading = true
        })
        .addCase(seacrhNearByDriver.fulfilled,(state,action)=>{
            state.success = true
            state.nearbyDrivers = action?.payload?.getNearByDrivers
            state.additionalSearchMetaData = action?.payload?.getAdditionalTripData
        })
        .addCase(seacrhNearByDriver.rejected,(state,action)=>{
            state.error = ''
        })
        .addCase(requestRideAction.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(requestRideAction.fulfilled,(state,action)=>{
            localStorage.setItem('tripDetail',JSON.stringify(action.payload?.tripdata))
            localStorage.setItem('tripStatus','requested')
            
            state.success = true
            state.tripDetail = action.payload?.tripdata
            state.tripStatus = "requested"
            state.message = action.payload?.message
        })
        .addCase(requestRideAction.rejected,(state,action)=>{
            
        })
        .addCase(acceptTrip.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(acceptTrip.fulfilled,(state,action)=>{
            
            localStorage.setItem('tripDetail',JSON.stringify(action?.payload?.acceptRide))
            localStorage.setItem('tripStatus','accepted')

            state.tripDetail = action?.payload?.acceptRide
            state.tripStatus ="accepted"
        })
        .addCase(cancelRide.pending,(state)=>{
            state.loading = true
        })
        .addCase(cancelRide.fulfilled,(state,action)=>{
            state.tripStatus = action?.payload?.status
            // state.message = action?.payload?.message
            state.cancelData = action?.payload?.cancelDetails

        })
        .addCase(cancelRide.rejected,(state,action)=>{
            state.error = action?.payload
        })

        .addCase(startTrip.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(startTrip.fulfilled,(state,action)=>{
            localStorage.setItem('tripDetail',JSON.stringify(action?.payload?.tripDetail))
            state.tripStatus = "started"
            state.tripDetail = action?.payload?.tripDetail
            state.message = action?.payload?.message
        })
        .addCase(startTrip.rejected,(state,action)=>{
            // state.error = action?.payload
        })
        .addCase(finishRide.pending,(state)=>{
            state.loading = true
        })
        .addCase(finishRide.fulfilled,(state,action)=>{
            localStorage.removeItem('tripDetail')
            state.success = true
            state.message = action?.payload?.message
        })
        .addCase(finishRide.rejected,(state,action)=>{
            // state.error = 
        })
        .addCase(payment.pending,(state)=>{
            state.loading  = true
        })
        .addCase(payment.fulfilled,(state,action)=>{
            localStorage.setItem('paymentStatus','completed')
            state.paymentStatus = "completed"
        })
        .addCase(payment.rejected,(state,action)=>{

        })
    }
})
export const {setTripData,resetTripDetails,setTripStatus} = tripSlice.actions
export default tripSlice.reducer