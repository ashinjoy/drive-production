import React from 'react'
import UserNavbar from '../../../Components/Navbar/UserNavbar'
import Home from '../../../Components/User/Home/Home';
import Footer from '../../../Components/Footer/Footer';
import LocationModal from '../../../Components/User/Modal/LocationModal';
console.log('home');

function HomePage() {
  return (
    <>
    <UserNavbar/>
    <Home/>
    <Footer/>
    </>
  )
}

export default HomePage
