import React from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
const deliveryBoyIcon = new L.Icon({
    iconUrl: scooter,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})
const customerIcon = new L.Icon({
    iconUrl: home,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
})
function DeliveryBoyTracking({ data }) {
    // Add null checks for coordinates
    const deliveryBoyLat = data.deliveryBoyLocation?.lat || 0
    const deliveryBoylon = data.deliveryBoyLocation?.lon || 0
    const customerLat = data.customerLocation?.lat || 0
    const customerlon = data.customerLocation?.lon || 0

    // Only render if we have valid coordinates
    if (!deliveryBoyLat || !deliveryBoylon || !customerLat || !customerlon) {
        return (
            <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md bg-gray-100 flex items-center justify-center'>
                <p className='text-gray-500'>Location data not available</p>
            </div>
        )
    }

    const path = [
        [deliveryBoyLat, deliveryBoylon],
        [customerLat, customerlon]
    ]

    const center = [deliveryBoyLat, deliveryBoylon]

    return (
        <div className='w-full h-[400px] mt-3 rounded-xl overflow-hidden shadow-md'>
            <MapContainer
                className={"w-full h-full"}
                center={center}
                zoom={16}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
             <Marker position={[deliveryBoyLat,deliveryBoylon]} icon={deliveryBoyIcon}>
             <Popup>Delivery Boy</Popup>
             </Marker>
              <Marker position={[customerLat,customerlon]} icon={customerIcon}>
             <Popup>Customer</Popup>
             </Marker>


<Polyline positions={path} color='blue' weight={4}/>

            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking
