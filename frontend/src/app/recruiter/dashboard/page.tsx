"use client"
import React from 'react'
import Dcards from '@/components/ui/Dcards';
import { Joystick } from 'lucide-react';
const Dcard=[
{
  name:"All jobs",
  count:20,
  icon:<Joystick/>
},
{
  name:"All jobs",
  count:20,
  icon:<Joystick/>
},
{
  name:"All jobs",
  count:20,
  icon:<Joystick/>
}
];
const page = () => {
  return (
    <>
    <div>recruiter DashBoard</div>
    
    <Dcards/>
    </>
  )
}

export default page