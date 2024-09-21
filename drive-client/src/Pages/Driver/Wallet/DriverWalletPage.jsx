import React from 'react'
import WalletDetails from '../../../Components/Driver/Wallet/WalletDetails'
// import WalletHistory from '../../../Components/User/Wallet/WalletHistory'
import DriverNavBar from '../../../Components/Navbar/DriverNavBar'

function DriverWalletPage() {
  return (
    <>
    <DriverNavBar/>
    {/* <div className='flex justify-center'> */}
    
    <WalletDetails/>
    {/* </div> */}
    </>
  )
}

export default DriverWalletPage
