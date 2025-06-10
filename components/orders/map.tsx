'use client'

//Map component Component from library
import { GoogleMap, Marker, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { useTrackOrder } from "@/hooks/useTrackOrder";
import { useMapDirections } from "@/hooks/useMapDirections";
import Link from "next/link";
import { PulseLoader } from "react-spinners";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '60vh', // Changed from 80vh to be more responsive
    borderRadius: '12px',
};

interface MapComponentProps {
    orderId?: string;
}

const MapComponent = ({ orderId }: MapComponentProps) => {
    // Use custom hook for tracking order
    const { trackData, order, driver, loading, error } = useTrackOrder(orderId);
    
    // Use custom hook for map directions and markers
    const {
        directions,
        directionsRequested,
        directionsCallback,
        defaultMapCenter,
        defaultMapZoom,
        defaultMapOptions,
        getLatLng,
        directionsServiceOptions,
        directionsRendererOptions,
        markerIcons,
        sourceLocation,
        destinationLocation,
        driverLocation
    } = useMapDirections(trackData);

    // Handle authentication error specifically
    const isAuthError = error === 'Authentication required';

    return (
        <div className="w-full">
            {loading && (
                <div className="p-8 flex justify-center items-center min-h-[200px] bg-gray-50 dark:bg-dark-900/40 rounded-xl">
                    <div className="flex flex-col items-center space-y-4">
                        <PulseLoader color="#3B82F6" size={12} margin={2} />
                        <p className="text-dark-500 dark:text-light-400 mt-2 font-medium">Loading tracking information...</p>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="p-8 flex justify-center items-center min-h-[200px] bg-gray-50 dark:bg-dark-900/40 rounded-xl">
                    <div className="text-center max-w-md mx-auto">
                        <svg className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-dark-500 dark:text-light-400 mb-4">{error}</p>
                        
                        {isAuthError && (
                            <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
            
            {!error && !loading && (
                <div className="relative">
                    <div className="overflow-hidden rounded-xl shadow-lg">
                        <GoogleMap
                            mapContainerStyle={defaultMapContainerStyle}
                            center={defaultMapCenter}
                            zoom={defaultMapZoom}
                            options={{
                                ...defaultMapOptions,
                                fullscreenControl: true,
                                zoomControl: true,
                                streetViewControl: false,
                                mapTypeControl: false,
                                styles: [
                                    {
                                        featureType: "all",
                                        elementType: "labels.text.fill",
                                        stylers: [{ color: "#7c93a3" }, { lightness: -10 }]
                                    },
                                    {
                                        featureType: "administrative.country",
                                        elementType: "geometry",
                                        stylers: [{ visibility: "on" }]
                                    },
                                    {
                                        featureType: "administrative.country",
                                        elementType: "geometry.stroke",
                                        stylers: [{ color: "#c2d1d6" }, { lightness: -20 }]
                                    },
                                    {
                                        featureType: "landscape",
                                        elementType: "all",
                                        stylers: [{ color: "#f9f9f9" }]
                                    },
                                    {
                                        featureType: "water",
                                        elementType: "all",
                                        stylers: [{ color: "#BDE1F5" }]
                                    }
                                ]
                            }}
                        >
                            {/* Show directions if we have tracking data */}
                            {trackData && !directionsRequested.current && directionsServiceOptions && (
                                <DirectionsService
                                    options={directionsServiceOptions}
                                    callback={directionsCallback}
                                />
                            )}
                            
                            {directions && directionsRendererOptions && (
                                <DirectionsRenderer options={directionsRendererOptions} />
                            )}
                            
                            {/* Markers are only rendered when we have tracking data */}
                            {trackData && (
                                <>
                                    {/* Business/Source Marker */}
                                    {sourceLocation && (
                                        <Marker
                                            position={getLatLng(sourceLocation)}
                                            icon={markerIcons.shop}
                                            title="Business Location"
                                        />
                                    )}
                                    
                                    {/* Destination Marker */}
                                    {destinationLocation && (
                                        <Marker
                                            position={getLatLng(destinationLocation)}
                                            icon={markerIcons.destination}
                                            title="Delivery Destination"
                                        />
                                    )}
                                    
                                    {/* Driver Marker */}
                                    {driverLocation && (
                                        <Marker
                                            position={getLatLng(driverLocation)}
                                            icon={markerIcons.driver}
                                            title="Driver Location"
                                        />
                                    )}
                                </>
                            )}
                        </GoogleMap>
                    </div>
                    
                    {trackData && order && (
                        <div className="bg-white dark:bg-dark-800 shadow-sm rounded-b-lg border border-t-0 border-gray-200 dark:border-dark-700 p-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <div>
                                    <h3 className="text-base font-medium text-dark-900 dark:text-white">
                                        Order #{order.id.substring(0, 8)}
                                    </h3>
                                    <p className="text-sm text-dark-500 dark:text-light-400">
                                        {order.status || order.order_status || 'Status Unknown'}
                                    </p>
                                </div>
                                
                                {driver && (
                                    <div className="mt-2 sm:mt-0 bg-light-100 dark:bg-dark-700 rounded-lg p-2 flex items-center">
                                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-2">
                                            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-dark-500 dark:text-light-400">Driver</p>
                                            <p className="text-sm font-medium text-dark-900 dark:text-white">
                                                {driver.first_name} {driver.last_name}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex space-x-3">
                                {order.latest_time_of_delivery && (
                                    <div className="px-3 py-2 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center text-sm text-dark-700 dark:text-light-300">
                                        <svg className="w-4 h-4 mr-1 text-dark-500 dark:text-light-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>Expected Delivery: {new Date(order.latest_time_of_delivery).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                )}
                                {driver && (
                                    <div className="px-3 py-2 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center text-sm text-dark-700 dark:text-light-300">
                                        <svg className="w-4 h-4 mr-1 text-dark-500 dark:text-light-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span>Live Tracking</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { MapComponent };