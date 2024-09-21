import React, { useContext, useEffect, useState } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";

import SuggesstionBox from "../SuggestionBox/SuggesstionBox";
import { UserPrivate } from "../../../Utils/Axios/userInterceptor";
import { Geocoder } from "@mapbox/search-js-react";
import { seacrhNearByDriver } from "../../../Features/Trip/tripActions";
import { searchLocationContext } from "../../../Context/UserSearchContext";

// import ListVehiclePriceDetails from "../Trip/ListVehiclePriceDetails";

function SearchLocation({isSearch,setSearch}) {
  const {
    selectDropOffLocation,
    pickUpCoords,
    dropCoords,
    selectPickupLocation,
    pickupLocation,
    setPickupLocation,
    dropLocation,
    setDropLocation,
  } = useContext(searchLocationContext);

  const [isPickUpSuggestion, setPickupSuggestion] = useState(false);

  // const [pickupLocation, setPickupLocation] = useState("");
  // const [isSearch, setSearch] = useState(false);
  // const [dropLocation, setDropLocation] = useState("");

  const [suggestions, setSuggestions] = useState([]);

  const { user } = useSelector((state) => state.user);
  const { additionalSearchMetaData } = useSelector((state) => state.trip);

  const dispatch = useDispatch();

  const handlePickUpLocation = async (e) => {
    const { value } = e.target;
    setPickupLocation(value);

    try {
      const response = await UserPrivate.get(
        `trip/users/pickup-location-autocomplete?search=${value}`
      );
      const data = response.data;
      setSuggestions(data?.searchResults);
    } catch (error) {
      console.error("Error fetching pickup location suggestions:", error);
    }
  };

  const handleDropoffLocation = (evt) => {
    setDropLocation(evt);
  };

  const handleResult = (result) => {
    selectDropOffLocation(result?.geometry?.coordinates);
  };

  const handleSearchRide = (event) => {
    event.preventDefault();
    const formData = {
      userId: user?.id,
      pickupLocation: pickUpCoords,
      dropoffLocation: dropCoords,
    };

    dispatch(seacrhNearByDriver(formData));
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const response = await UserPrivate.get(
        `trip/users/pickup-location-autocomplete?search=${[
          pos?.coords?.longitude,
          pos?.coords?.latitude,
        ]}`
      );
      console.log(
        "pickup",
        response?.data?.searchResult?.properties?.full_address
      );
      setPickupLocation(response?.data?.searchResult?.properties?.full_address);
      selectPickupLocation([pos?.coords?.longitude, pos?.coords?.latitude]);
    });
  };

  useEffect(() => {
    if (additionalSearchMetaData) {
      setSearch(true);
    } else {
      console.log("No metdata");
    }
  }, [additionalSearchMetaData]);

  useEffect(()=>{
    console.log("isSearch clicked",isSearch);
    

  },[isSearch])

  return (
    <>
      <div className="flex w-[34%]">
        <div className="mt-[7rem] ml-[2rem]  ">
          <div className="w-[100%] h-auto p-3  shadow-xl border-2 border-slate-300 rounded-lg bg-white flex flex-col gap-3">
            <h1 className="font-medium text-xl text-gray-700">Start Ride</h1>
            <form action="" onSubmit={handleSearchRide}>
              <div className="flex flex-col w-full max-w-md mx-auto relative">
                <label
                  htmlFor="pickup"
                  className="text-sm font-medium text-gray-700 mb-2"
                >
                  Pickup Location
                </label>
                <div className="flex h-10 items-center border-2 border-gray-300 rounded-md overflow-hidden shadow-md focus-within:border-blue-500 transition duration-200">
                  <input
                    type="text"
                    id="pickup"
                    placeholder="Enter pickup location"
                    className="w-full h-10 px-4 text-gray-700 outline-none flex-1"
                    onFocus={() => setPickupSuggestion(true)}
                    value={pickupLocation}
                    onChange={handlePickUpLocation}
                  />
                  <button
                    type="button"
                    className="h-12 w-12 text-black flex items-center justify-center transition duration-200"
                    onClick={handleCurrentLocation}
                  >
                    <FaLocationArrow />
                  </button>
                </div>

                {isPickUpSuggestion && (
                  <SuggesstionBox
                    suggestions={suggestions}
                    setPickupLocation={setPickupLocation}
                    setSuggestions={setSuggestions}
                    setPickupSuggestion={setPickupSuggestion}
                  />
                )}
              </div>
              <div className="flex flex-col relative mt-3">
                <label
                  htmlFor="dropoff"
                  className="text-sm font-medium text-gray-600 mb-2"
                >
                  Dropoff Location
                </label>
                <Geocoder
                  value={dropLocation}
                  placeholder="Dropoff Location"
                  onRetrieve={handleResult}
                  onChange={handleDropoffLocation}
                  accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                />
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-yellow-400 mt-4 text-white font-semibold rounded-md hover:bg-yellow-500 focus:bg-yellow-600 transition duration-200"
              >
                Search Ride
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* {isSearch && (
        <ListVehiclePriceDetails
          pickUpCoords={pickUpCoords}
          dropCoords={dropCoords}
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
        />
      )} */}
    </>
  );
}

export default SearchLocation;
