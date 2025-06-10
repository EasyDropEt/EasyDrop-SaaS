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
    const { trackData, loading, error } = useTrackOrder(orderId);
    
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
        markerIcons
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
                <div className="p-6 text-center bg-gray-50 dark:bg-dark-900/40 rounded-xl">
                    <div className={`mb-2 p-4 rounded-lg shadow-sm ${isAuthError ? 'bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-400' : 'bg-red-50 border border-red-200 text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'}`}>
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p className="font-semibold">{error}</p>
                        </div>
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
                                    <Marker
                                        position={getLatLng(trackData.source_location)}
                                        icon={markerIcons.shop}
                                        onClick={() => window.alert('Business Location')}
                                    />
                                    
                                    {/* Destination Marker */}
                                    <Marker
                                        position={getLatLng(trackData.destination_location)}
                                        icon={markerIcons.destination}
                                        onClick={() => window.alert('Delivery Destination')}
                                    />
                                    
                                    {/* Driver Marker */}
                                    <Marker
                                        position={getLatLng(trackData.driver_location)}
                                        icon={markerIcons.driver}
                                        onClick={() => window.alert('Driver Location')}
                                    />
                                </>
                            )}
                        </GoogleMap>
                    </div>
                    
                    {trackData && (
                        <div className="mt-4 p-5 bg-white dark:bg-dark-800 rounded-xl shadow-md border border-light-200 dark:border-dark-700">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                <div className="mb-3 sm:mb-0">
                                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white flex items-center">
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-2 ${trackData.status === 'DELIVERED' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-400'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                            </svg>
                                        </span>
                                        Delivery Status: {trackData.status}
                                    </h3>
                                    <p className="text-dark-600 dark:text-light-400 mt-1">
                                        Estimated arrival: <span className="font-medium">{new Date(trackData.estimated_arrival_time).toLocaleTimeString()}</span>
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <div className="px-3 py-2 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center text-sm text-dark-700 dark:text-light-300">
                                        <svg className="w-4 h-4 mr-1 text-dark-500 dark:text-light-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span>On Time</span>
                                    </div>
                                    <div className="px-3 py-2 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center text-sm text-dark-700 dark:text-light-300">
                                        <svg className="w-4 h-4 mr-1 text-dark-500 dark:text-light-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <span>Live Tracking</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { MapComponent };