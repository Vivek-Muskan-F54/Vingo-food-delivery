import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useUpdateLocation() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)

    useEffect(()=>{
const updateLocation=async (lat,lon) => {
    try {
        const result=await axios.post(`${serverUrl}/api/user/update-location`,{lat,lon},{withCredentials:true})
        console.log(result.data)
    } catch (error) {
        console.error('Failed to update location:', error)
    }
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (pos)=>{
            updateLocation(pos.coords.latitude,pos.coords.longitude)
        },
        (error)=>{
            console.error('Geolocation error:', error.message)
            // Handle different error codes
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.warn('User denied the request for Geolocation.')
                    break
                case error.POSITION_UNAVAILABLE:
                    console.warn('Location information is unavailable.')
                    break
                case error.TIMEOUT:
                    console.warn('The request to get user location timed out.')
                    break
                default:
                    console.warn('An unknown error occurred.')
                    break
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    )
} else {
    console.warn('Geolocation is not supported by this browser.')
}
    },[userData])
}

export default useUpdateLocation
