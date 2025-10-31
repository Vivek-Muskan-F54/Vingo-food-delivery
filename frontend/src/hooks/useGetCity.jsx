import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState, setUserData } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'

function useGetCity() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
    const apiKey=import.meta.env.VITE_GEOAPIKEY
    useEffect(()=>{
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        async (position)=>{
            console.log(position)
            const latitude=position.coords.latitude
            const longitude=position.coords.longitude
            dispatch(setLocation({lat:latitude,lon:longitude}))
            try {
                const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
                console.log(result.data)
                const city = result?.data?.results[0]?.city || result?.data?.results[0]?.county || 'Unknown'
                dispatch(setCurrentCity(city))
                dispatch(setCurrentState(result?.data?.results[0]?.state || 'Unknown'))
                dispatch(setCurrentAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1 || 'Unknown'))
                dispatch(setAddress(result?.data?.results[0]?.address_line2 || result?.data?.results[0]?.address_line1 || 'Unknown'))
            } catch (error) {
                console.error('Failed to get city from coordinates:', error)
                // Set default values if geocoding fails
                dispatch(setCurrentCity('Unknown'))
                dispatch(setCurrentState('Unknown'))
                dispatch(setCurrentAddress('Unknown'))
                dispatch(setAddress('Unknown'))
            }
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
            // Set default values if geolocation fails
            dispatch(setCurrentCity('Unknown'))
            dispatch(setCurrentState('Unknown'))
            dispatch(setCurrentAddress('Unknown'))
            dispatch(setAddress('Unknown'))
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
        }
    )
} else {
    console.warn('Geolocation is not supported by this browser.')
    // Set default values if geolocation is not supported
    dispatch(setCurrentCity('Unknown'))
    dispatch(setCurrentState('Unknown'))
    dispatch(setCurrentAddress('Unknown'))
    dispatch(setAddress('Unknown'))
}
    },[userData])
}

export default useGetCity
