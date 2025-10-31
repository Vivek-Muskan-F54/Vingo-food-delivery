import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity, setUserData } from '../redux/userSlice'

function useGetShopByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
  useEffect(()=>{
  const fetchShops=async () => {
    const cityToFetch = currentCity && currentCity !== 'Unknown' ? currentCity : 'Unknown'
    try {
           const result=await axios.get(`${serverUrl}/api/shop/get-by-city/${cityToFetch}`,{withCredentials:true})
            dispatch(setShopsInMyCity(result.data))
           console.log('Shops fetched:', result.data)
    } catch (error) {
        console.error('Failed to fetch shops:', error)
        dispatch(setShopsInMyCity([])) // Set empty array on error
    }
}
fetchShops()

  },[currentCity])
}

export default useGetShopByCity
