import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity, setShopsInMyCity, setUserData } from '../redux/userSlice'

function useGetItemsByCity() {
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
  useEffect(()=>{
  const fetchItems=async () => {
    const cityToFetch = currentCity && currentCity !== 'Unknown' ? currentCity : 'Unknown'
    try {
           const result=await axios.get(`${serverUrl}/api/item/get-by-city/${cityToFetch}`,{withCredentials:true})
            dispatch(setItemsInMyCity(result.data))
           console.log('Items fetched:', result.data)
    } catch (error) {
        console.error('Failed to fetch items:', error)
        dispatch(setItemsInMyCity([])) // Set empty array on error
    }
}
fetchItems()

  },[currentCity])
}

export default useGetItemsByCity
