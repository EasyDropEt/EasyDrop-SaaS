'use client'

//Map component Component from library
import { GoogleMap, Marker, DirectionsRenderer, DirectionsService } from "@react-google-maps/api";
import { useTrackOrder } from "@/hooks/useTrackOrder";
import { useMapDirections } from "@/hooks/useMapDirections";
import Link from "next/link";

//Map's styling
export const defaultMapContainerStyle = {
    width: '100%',
    height: '80vh',
    borderRadius: '15px 0px 0px 15px',
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
            {loading && <div className="p-4 text-center">Loading tracking information...</div>}
            
            {error && (
                <div className="p-4 text-center">
                    <div className={`mb-2 p-4 rounded ${isAuthError ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-500'}`}>
                        <p className="font-semibold">{error}</p>
                    </div>
                </div>
            )}
            
            {!error && (
                <>
                    <GoogleMap
                        mapContainerStyle={defaultMapContainerStyle}
                        center={defaultMapCenter}
                        zoom={defaultMapZoom}
                        options={defaultMapOptions}
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
                    
                    {trackData && (
                        <div className="mt-4 p-4 bg-white rounded shadow">
                            <h3 className="font-semibold">Delivery Status: {trackData.status}</h3>
                            <p>Estimated arrival: {new Date(trackData.estimated_arrival_time).toLocaleTimeString()}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export { MapComponent };