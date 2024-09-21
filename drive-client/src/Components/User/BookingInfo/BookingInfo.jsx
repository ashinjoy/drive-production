import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chat from "../../Chat/Chat";
import {
  paymentService,
  // stripePaymentService,
  // walletPaymentService,
} from "../../../Features/User/userService";
import { SosAlert } from "../../../Features/User/userActions";
import { UserPrivate } from "../../../Utils/Axios/userInterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { cancelRide, payment } from "../../../Features/Trip/tripActions";
import CancellationModal from "../Modal/CancellationModal";
import CancelConfirmedModal from "../Modal/CancelConfirmedModal";

function BookingInfo() {
  const { tripDetail, message ,tripStatus,paymentStatus} = useSelector((state) => state.trip);
  const [openChat, setOpenChat] = useState(false);
  // const [openPayment, setOpenPayment] = useState(false);
  const [cancelConfirmed, setCancelConfirmModal] = useState(false);

  const [payOption, setPayOption] = useState(false);
  const [openCancelModal, setCancelModal] = useState(false);
  const [OpenwalletModal,setOpenWallet] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [senderId, setSenderId] = useState(null);
  const [recieverId, setRecieverId] = useState(null);
  const { user } = useSelector((state) => state.user);

  const selectPaymentOption = async (e) => {
    setPayOption(e.target.value);
    const response = await UserPrivate.put("trip/users/change-paymentmode", {
      tripId: tripDetail?._id,
      paymentMethod: e.target.value,
    });
  };
  useEffect(() => {
    if (tripDetail && tripStatus == "accepted") {
      setRecieverId(tripDetail?.driverId);
      setSenderId(tripDetail?.userId);
      setPayOption(tripDetail?.paymentMethod);
    }
  }, [tripDetail,tripStatus]);

  const handlePayment = async () => {
    const data = {
      userId: user?.id,
      tripId: tripDetail?._id,
      driverId: tripDetail?.driverId,
      paymentMethod: payOption,
      fare: tripDetail?.fare,
    };
    // if (payOption == "Online-Payment") {
    //   const response = await paymentService(data);
    //   console.log("response", response);
    //   if (response.payment?.url) {
    //     window.location.href = response.payment.url;
    //     console.log('before the url');


    //   }
    // } else if (payOption == "Wallet") {
    //   const response = await walletPaymentService(data);
    // }
    dispatch(payment(data))

  };

  useEffect(()=>{

  },[paymentStatus])
  const handleSos = () => {
    dispatch(SosAlert(user?.id));
  };
  const handleCancelRide = () => {
    if(tripStatus == "requested"){
      setCancelModal(true);
    }else if(tripStatus == "accepted"){
      setCancelConfirmModal(true)
    }
    dispatch(cancelRide({userId:user?.id,tripId:tripDetail?._id}))
  };

  useEffect(() => {
    if (message == "No Response from Drivers") {
      toast(
        "Drivers Not Available! Try again from differrnt Pickup Location or Retry after Sometime"
      );
      navigate("/search-ride");
    }
  });

  

  return (
    <div className="w-[20rem] mt-[7rem] ml-[3rem] border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden min-h-[80vh]">
  {openChat && (
    <Chat openChat={openChat} user={user} setOpenChat={setOpenChat} />
  )}

  <div className="relative h-[14rem] p-4 bg-gradient-to-r from-purple-50 to-blue-100 text-black">
    <h1 className="text-center text-xl font-bold tracking-wide">
      {(tripStatus == "accepted" || tripStatus == "started") ? "Driver Details" : "Looking For Nearby Drivers"}
    </h1>

    {tripStatus == "requested" ? (
      <img
        src="/assets/ai-generated-magnifying-glass-cartoon-png-transformed.webp"
        alt="img"
        className="h-[50%] w-auto mx-auto mt-6 opacity-90 animate-pulse"
      />
    ) : (
      tripDetail?.driverDetails && (
        <>
          <img
            src={tripDetail?.driverDetails?.profileImg}
            alt="Driver Profile"
            className="h-[45%] w-auto mx-auto mt-2 rounded-sm shadow-md"
          />
          <div className="mt-2 text-center">
            <h2 className="text-lg font-semibold">
              {tripDetail?.driverDetails?.name}
            </h2>
            <p className="text-sm text-gray-600">
              {tripDetail?.driverDetails?.email}
            </p>
            <p className="text-sm text-gray-600">
              {tripDetail?.driverDetails?.phone}
            </p>
          </div>
        </>
      )
    )}
  </div>

  <div className="p-4 flex flex-col gap-2 overflow-y-scroll h-[27%]">
    <div className="flex justify-between items-center">
      <h1 className="font-semibold text-gray-600">Pick-Up Location:</h1>
      <span className="text-gray-800 font-medium">{tripDetail?.pickUpLocation || "N/A"}</span>
    </div>
    <div className="flex justify-between items-center">
      <h1 className="font-semibold text-gray-600">Drop-Off Location:</h1>
      <span className="text-gray-800 font-medium">{tripDetail?.dropOffLocation || "N/A"}</span>
    </div>
    <div className="flex justify-between items-center">
      <h1 className="font-semibold text-gray-600">Fare:</h1>
      <span className="text-gray-800 font-medium">{tripDetail?.fare ? `₹${tripDetail.fare}` : "N/A"}</span>
    </div>
    <div className="flex justify-between items-center">
      <h1 className="font-semibold text-gray-600">Estimated Time:</h1>
      <span className="text-gray-800 font-medium">
        {tripDetail?.duration ? `${Math.ceil(parseFloat(tripDetail.duration) / 60)} min` : "N/A"}
      </span>
    </div>
  </div>

  {openCancelModal && (
    <CancellationModal
      setCancelModal={setCancelModal}
      setCancelConfirmModal={setCancelConfirmModal}
    />
  )}
  {cancelConfirmed && <CancelConfirmedModal />}

  <div className="flex flex-col items-center gap-4 p-4">
    {(tripStatus == "accepted" || tripStatus == "started") && (
      <button
        className="bg-blue-500 w-full p-2 rounded-full text-white font-semibold hover:bg-blue-600 transition-colors shadow-md"
        onClick={() => setOpenChat(true)}
      >
        Chat
      </button>
    )}

    {((tripStatus == "accepted" || tripStatus == "started") &&  (paymentStatus != "completed")) && (
      <>
        <select
          className="bg-white border border-gray-300 p-2 rounded-md"
          value={payOption}
          name=""
          id=""
          onChange={selectPaymentOption}
        >
          <option value="Cash">Cash</option>
          <option value="Online-Payment">Pay Online</option>
          <option value="Wallet">Wallet</option>
        </select>
        <button
          className="bg-green-500 w-full p-2 rounded-full text-white font-semibold hover:bg-green-600 transition-colors shadow-md"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </>
    )}

    {(tripStatus == "accepted" || tripStatus == "started")  && (
      <div className="flex justify-center items-center">
        <button
          className="relative px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition transform hover:scale-105 focus:ring-4 focus:ring-red-300 focus:outline-none"
          onClick={handleSos}
        >
          <svg
            className="inline-block w-5 h-5 mr-2 animate-pulse"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 11h14M5 11l-1 5m0 0H4a2 2 0 001.68 1.98L7 19h10l1.32-.02A2 2 0 0020 16h-1l-1-5m-12 0L5 7h14l1 4m-2-6V4a2 2 0 00-2-2h-6a2 2 0 00-2 2v1m0 6h6"
            />
          </svg>
          SOS
          <span className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 h-3 w-3 rounded-full animate-ping"></span>
        </button>
      </div>
    )}

    {(tripStatus == "accepted" || tripStatus == "requested") && (
      <button
        className="bg-gray-300 w-full p-2 rounded-sm text-red-600 font-semibold hover:bg-gray-400 transition-colors shadow-md"
        onClick={handleCancelRide}
      >
        Cancel Ride
      </button>
    )}
  </div>
</div>

  );
}

export default BookingInfo;
