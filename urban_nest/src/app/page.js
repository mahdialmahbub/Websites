import React from 'react'
import NavBar from './Components/navbar/NavBar'
import Home from './Components/home/Home'
import Counter from './Components/counter/Counter'
import Feature from './Components/feature/Feature'
import FindProperty from './Components/findProperty/FindProperty'

const page = () => {
  return (
    <div>
        <NavBar/>
        <Home/>
        <Counter/> 
        <Feature/>
        <FindProperty/>
    </div>
  )
}

export default page