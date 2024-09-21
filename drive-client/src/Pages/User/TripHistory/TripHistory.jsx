import React, { useEffect, useState } from 'react'
import UserNavbar from '../../../Components/Navbar/UserNavbar'
import TripCard from '../../../Components/TripCard/TripCard'
import { getAllTripsService } from '../../../Features/Trip/tripService'
import { useSelector } from 'react-redux'

function TripHistory() {
    const [tripDetails,settripDetails] = useState([])
    const [pages,setPages] = useState(null)
    const {user} = useSelector(state=>state.user)
    useEffect(()=>{
        const getAllTrips=async()=>{
        const response = await getAllTripsService(user?.id)        
        settripDetails(response?.getTripDetails)
        setPages(new Array(response?.docsCount))
        }
        getAllTrips()
    },[])
  return (
    <>
    <UserNavbar/>
    <div className=" h-[80%] w-full mt-[7rem] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6">My Trips</h1>
       {(tripDetails && tripDetails.length > 0 ) && tripDetails.map((trip)=>{
        const dateFormat = new Date(trip?.createdAt)
        const formattedDate =dateFormat.toLocaleString('en-US',{
            month:'short',
            day:'2-digit'
        })
        const formattedTime = dateFormat.toLocaleString('en-US', {
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          }).replace(":", ".");
      return ( <TripCard
        title={trip?.pickUpLocation}
        date={formattedDate}
        time={formattedTime}
        price={trip?.fare}
        status={trip?.tripStatus}
        id = {trip?._id}
      />)
       })} 
       <div className='flex flex-row gap-3'>
       {/* <span className='w-[3rem] h-[2rem] rounded-sm border-2 shadow-sm bg-slate-300 text-black text-center'>
      prev
    </span>
    <span className='w-[3rem] h-[2rem] rounded-sm border-2 shadow-sm bg-slate-300 text-black text-center'>
      1
    </span>
    <span className='w-[3rem] h-[2rem] rounded-sm border-2 shadow-sm bg-slate-300 text-black text-center'>
      2
    </span>
    <span className='w-[3rem] h-[2rem] rounded-sm border-2 shadow-sm bg-slate-300 text-black text-center'>
      next
    </span> */}
    

    </div>
    
    </div>

    </>
  )
}

export default TripHistory
