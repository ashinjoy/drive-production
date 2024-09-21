import React, { useContext, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker, Source, Layer } from "react-map-gl";
import { searchLocationContext } from "../../../Context/UserSearchContext";
import { useSelector } from "react-redux";
import { useSocket } from "../../../Hooks/socket";
import axios from "axios";
import NearByPickup from "../Notification/NearByPickup";
function LiveMapUpdates() {
  const mapContainerRef = useRef(null);
  const { token, user } = useSelector((state) => state.user);
  const { tripDetail,tripStatus } = useSelector((state) => state.trip);

  const [pickup, setPickUp] = useState([]);
  const [dropOff, setDropoff] = useState([]);
  const [driverCoords, setDriverCoords] = useState([]);
  const [viewState, setViewState] = useState({});
  const [liveUpdates,setLiveUpdate] = useState({})

  

  const [route,setRoute] = useState(null)

  const {socket,chatSocket} = useSocket();
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v12");

  useEffect(()=>{
    if(chatSocket && token){
      console.log("chatspckket");
      
      chatSocket?.emit("user-chat-connect",{userId:user?.id})
    }
    // return ()=>{
    //   chatSocket?.off()
    // }

  },[chatSocket])

  useEffect(() => {
    console.log('tripDetual',tripDetail);
    if(tripDetail && (tripStatus == "started" || tripStatus == "accepted")){
    setPickUp(tripDetail?.startLocation?.coordinates);
    setDropoff(tripDetail?.endLocation?.coordinates);
    // setDriverCoords(tripDetail?.driverId?.currentLocation?.coordinates)
    setDriverCoords(tripDetail?.driverDetails?.currentLocation?.coordinates)



  
    const getRoute = async()=>{
    const response =   await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${tripDetail?.driverDetails?.currentLocation?.coordinates[0]},${tripDetail?.driverDetails?.currentLocation?.coordinates[1]};${tripDetail?.startLocation?.coordinates[0]},${tripDetail?.startLocation?.coordinates[1]};${tripDetail?.endLocation?.coordinates[0]},${tripDetail?.endLocation?.coordinates[1]}?geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
    console.log('response Data',response.data)
    const routeInfo =response.data
    setRoute(routeInfo?.routes[0]?.geometry)
    }
      const bounds = [
        [
          Math.min(tripDetail?.startLocation?.coordinates[0], tripDetail?.endLocation?.coordinates[0],tripDetail?.driverDetails?.currentLocation?.coordinates[0] ),
          Math.min(tripDetail?.startLocation?.coordinates[1], tripDetail?.endLocation?.coordinates[1],tripDetail?.driverDetails?.currentLocation?.coordinates[1] ),
        ], 
        [
          Math.max(tripDetail?.startLocation?.coordinates[0], tripDetail?.endLocation?.coordinates[0],tripDetail?.driverDetails?.currentLocation?.coordinates[0]),
          Math.max(tripDetail?.startLocation?.coordinates[1], tripDetail?.endLocation?.coordinates[1],tripDetail?.driverDetails?.currentLocation?.coordinates[1]),
        ], 
      ];
  
      
      if (mapContainerRef.current) {
        mapContainerRef.current.fitBounds(bounds, {
          padding: 20, 
        });
      }
      getRoute()
    }
    
  }, [tripDetail]);

  useEffect(() => {
      if(socket && tripDetail && (tripStatus == "accepted" || tripStatus == "started")){
        socket?.on("live-location",(data)=>{
        console.log('positional Coordinates-Live Trackinggggggggggg',data);          
        // setDriverCoords([data?.pos?.coords?.longitude,data?.pos?.coords?.latitude]);
        setDriverCoords(data?.liveLocation)
          })
        // socket.on("dummy-event",()=>console.log("Worked")
        // )
      }

  }, [socket,tripDetail,driverCoords,tripStatus]);



  const routeLine = {
    id: "route",
    type: "line",
    source: "route",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#3887be",
      "line-width": 5,
      "line-opacity": 0.75,
    },
  };


  return (
    <>
    <Map
    ref={mapContainerRef}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      style={{ width: "65%", height: "35rem",position:"fixed", top:"7rem",right:"2rem"}}
      attributionControl={false} 
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    >
      {pickup.length > 0 && (
        <Marker
          longitude={pickup[0]}
          latitude={pickup[1]}
          style={{ width: "2rem"}}
        >
          <img src="/assets/pickup_marker.png" alt="Dropoff Marker" />
        </Marker>
      )}
      {dropOff.length > 0 && (
        <Marker
          longitude={dropOff[0]}
          latitude={dropOff[1]}
          style={{ width: "2rem" }}
        >
          <img src="/assets/dest_marker.png" alt="Dropoff Marker" />
        </Marker>
      )}

      {driverCoords.length > 0 && (
        <Marker
          longitude={driverCoords[0]}
          latitude={driverCoords[1]}
          style={{ width: "2rem" }}
        >
        <img
            src="/assets/wifi-tracking.png"
            alt="Dropoff Marker"
        />
        </Marker>
      )}
         {route && (
            <Source id="route" type="geojson" data={route}>
              <Layer {...routeLine} />
            </Source>
          )}
    </Map>
   </>
  );
}

export default LiveMapUpdates;
