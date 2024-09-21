import React, { useContext, useEffect, useRef, useState } from "react";
import {  useDispatch, useSelector } from "react-redux";
import {  NavLink } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import * as turf from '@turf/turf'

import { useSocket } from "../../Hooks/socket";

import RideRequestNotifications from "../Driver/Notifications/RideRequestNotifications";
import { driverLiveLocation } from "../../Context/DriverLocation";


import { MdSpaceDashboard } from "react-icons/md";
import { GiJourney } from "react-icons/gi";
import { FaWallet } from "react-icons/fa6";

import { MdPayments ,MdPerson } from "react-icons/md";
import { resetTripDetails } from "../../Features/Trip/tripSlice";
import { current } from "@reduxjs/toolkit";
import { logoutAction } from "../../Features/Driver/driverActions";




// import { logoutAction } from '../../Features/Driver/driverActions';
function DriverNavBar() {
  const [openNotification, setOpenNotification] = useState(false);
  const [trip, setTrip] = useState(null);
  const notificationDurationRef = useRef(null);
  const [rideStarted,setRideStarted] = useState(false)
  const liveIntervalRef = useRef(null)
  const arrayIndexRef = useRef(0)

  const { setDriverLive,tripCoordinates,  setEnableChat ,driverLive,startRide,setTripCoordintes} =
    useContext(driverLiveLocation);

  const { token, driver } = useSelector((state) => state.driver);
  const { tripDetail,tripStatus } = useSelector((state) => state.trip);
  const { socket, chatSocket } = useSocket();
  const dispatch = useDispatch()
  const handleLogout = ()=>{
    dispatch(logoutAction())
  }
  useEffect(() => {
    // let timeOut

    const handleRideRequest = (tripData) => {
      setTrip(tripData);
      setOpenNotification(true);
      chatSocket?.emit("driver-chat-connect", { driverId: driver?.id })
      setEnableChat(true);
      notificationDurationRef.current = setTimeout(() => {
        setOpenNotification(false);
      }, 13000);
    };
    if (token && driver) {
      socket?.emit("driver-connected", driver.id);
      socket?.on("ride-request", (tripData) => {
        handleRideRequest(tripData);
      });
    }
    return () => {
      clearTimeout(notificationDurationRef.current);
      socket?.off("ride-request");
    };
  }, [socket, chatSocket]);

  useEffect(() => {
    // if (token && driver && tripDetail) {
    //   if (navigator.geolocation) {
    //     navigator.geolocation?.watchPosition(
    //       (pos) => {
    //         const drivercooordinates = [
    //           pos?.coords?.longitude,
    //           pos?.coords?.latitude,
    //         ];

    //         setDriverLive(drivercooordinates);
    //         socket?.emit("location-update", {
    //           pos,
    //           userId: tripDetail?.userId,
    //         });
    //       },
    //       (err) => {
    //         console.error(err);
    //       },
    //       {
    //         enableHighAccuracy: false,
    //         maximumAge: 0,
    //       }
    //     );
    //   }
    // }
    if(!token || !driver || !tripDetail){
      return
    }

    
    
    
      liveIntervalRef.current =   setInterval(()=>{
      if(arrayIndexRef.current < tripCoordinates.length){
        // console.log('inside the interval');
        
        // console.log("tripcoord",tripCoordinates);
        // console.log('started',startRide);
// if near pickup when start button appear the car hould stop and confirm pickup then only car should move
// console.log("startRide inside the innterval",startRide);

if(startRide){
  console.log('start Ride');
  console.log('entered inside the condition');
  clearInterval(liveIntervalRef.current)
  return
}   
const handleJourneyAfterStart =()=>{

const coordinates = [...tripCoordinates]
console.log(arrayIndexRef.current);
console.log('coordsss',coordinates);

const splicedArr = coordinates.splice(0,arrayIndexRef.current)
console.log('spl',coordinates);
setTripCoordintes(coordinates)
}
if(tripStatus == 'started'){
  if(!rideStarted){
    console.log('inside the condition');
    
  handleJourneyAfterStart()
  setRideStarted(true)
  }
  
}
console.log('outdide  the condition');
     
    setDriverLive(tripCoordinates[arrayIndexRef.current])
       socket?.emit("location-update", {
                   liveLocation:tripCoordinates[arrayIndexRef.current],
                   userId: tripDetail?.userId,
                })
    arrayIndexRef.current++

      }else{
        console.log('inside the terminatoin stage');
        
        clearInterval(liveIntervalRef.current)
      }

      },5000)
      socket?.on('cancel-ride',()=>{
        clearInterval(liveIntervalRef.current)
        dispatch(resetTripDetails())
      })
      return ()=>{
        clearInterval(liveIntervalRef.current)
        socket?.off('cancel-ride')
      }
      
    } ,[socket, tripDetail,tripCoordinates,startRide,tripStatus]);



    // useEffect(()=>{
    //   if(driverLive.length <= 0){
    //     return 
    //   }
    //   const pickup = tripDetail?.startLocation?.coordinates
    //   const dropOff = tripDetail?.endLocation?.coordinates
    //   const approxDistanceFromPickUp = checkApproxDistance(driverLive,pickup)
    //   console.log("appPickup",approxDistanceFromPickUp);
    //   const approxDistanceFromDrop = checkApproxDistance(driverLive,dropOff)
    //   console.log("appDropp",approxDistanceFromDrop);
    //   if(approxDistanceFromPickUp < 200){
    //     setStartRide(true)  
    //   }
    // },[driverLive])

    // const checkApproxDistance = (currentLocation,destination)=>{
    //   if(!currentLocation || !currentLocation.length > 0 || !destination || !destination.length > 0){
    //     return
    //   }
    //   const distance = turf.distance(currentLocation, destination, {
    //     units: "meters",
    //   });

    //   console.log(distance);
    // }

  return (
    <>
      {/* <nav className="flex flex-col min-h-screen gap-11 items-center  max-w-[12rem]  bg-white border border-gray-300 bg-gradient-to-t from-yellow-50 to-white text-black rounded-md shadow-xl p-3">
        <div>
          <img src="/assets/logo-cl.png" alt="logo" />
        </div>
        <div className="flex justify-between items-center">
        <NavLink className={"flex gap-2 text-lg font-semibold"}>
          <MdSpaceDashboard className="mt-1" />
          DashBoard
        </NavLink>
        </div>
        <div className="flex justify-between">
        <NavLink className={"flex gap-2 text-lg font-bold"} to="/driver/trip">
          <GiJourney className="mt-1" />
          Trip
        </NavLink>
        </div>
        <NavLink className={"flex gap-2 text-lg font-bold"} to="/driver/wallet">
          <FaWallet className="mt-1" />
          Wallet
        </NavLink>
        <NavLink className={"flex gap-2 text-lg font-bold"}>
          <MdPayments className="mt-1" />
          Payments
        </NavLink>
        <NavLink
          className={"flex gap-2 text-lg font-bold"}
          to="/driver/profile"
        >
          <MdPayments className="mt-1" />
          Profile
        </NavLink>
      </nav>
      <AnimatePresence mode="wait">
        {openNotification && (
          <RideRequestNotifications
            trip={trip}
            setOpenNotification={setOpenNotification}
          />
        )}
      </AnimatePresence> */}
      <nav className="fixed flex flex-col min-h-screen gap-6 items-center max-w-[12rem]   rounded-sm border-r-2  shadow-md p-3">
  <div className="flex items-center justify-center w-full">
    <img src="/assets/logo-cl.png" alt="logo" className="w-full " />
  </div>
  
  <div className="w-full">
    <NavLink to="/driver/home" className="flex gap-2 items-center text-lg font-semibold hover:bg-gray-100 p-3 rounded-lg transition-all">
      <MdSpaceDashboard className="text-xl" /> Home
    </NavLink>
  </div>
  
  <div className="w-full">
    <NavLink to="/driver/trip" className="flex gap-2 items-center text-lg font-semibold hover:bg-gray-100 p-3 rounded-lg transition-all">
      <GiJourney className="text-xl" /> Trip
    </NavLink>
  </div>
  
  <div className="w-full">
    <NavLink to="/driver/wallet" className="flex gap-2 items-center text-lg font-semibold hover:bg-gray-100 p-3 rounded-lg transition-all">
      <FaWallet className="text-xl" /> Wallet
    </NavLink>
  </div>
  
  <div className="w-full">
    <NavLink to="/driver/profile" className="flex gap-2 items-center text-lg font-semibold hover:bg-gray-100 p-3 rounded-lg transition-all">
      <MdPerson className="text-xl" /> Profile
    </NavLink>
  </div>
  <div className="w-full">
    <button  className="flex gap-2 items-center text-lg font-semibold hover:bg-gray-100 p-3 rounded-lg transition-all" onClick={handleLogout}>
      <MdSpaceDashboard className="text-xl" /> Logout
    </button>
  </div>
</nav>
<AnimatePresence mode="wait">
        {openNotification && (
          <RideRequestNotifications
            trip={trip}
            setOpenNotification={setOpenNotification}
          />
        )}
      </AnimatePresence> 

    </>
  );
}

export default DriverNavBar;
