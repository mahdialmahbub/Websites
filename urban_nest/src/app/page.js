import React from 'react'
import NavBar from './Components/navbar/NavBar'
import Home from './Components/home/Home'
import Counter from './Components/counter/Counter'
import Feature from './Components/feature/Feature'
import FindProperty from './Components/findProperty/FindProperty'
import AiAssistent from './Components/AiAssistent'
import MobileApp from './Components/MobileApp'
import Review from './Components/clientReview/Review'
import FinalCTA from './Components/FinalCTA'
import Footer from './Components/footer/Footer'
import FeaturedProperty from './Components/featuredProperty/FeaturedProperty'
import Trends from './Components/trends/Trends'

const page = () => {
  return (
    <div className=''>
        <Home/>
        <Counter/> 
        <Feature/>
        <FindProperty/>
        <FeaturedProperty />
        <Trends />
        <AiAssistent />
        <MobileApp />
        <Review />
        <FinalCTA />
    </div>
  )
}

export default page