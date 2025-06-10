'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { TrackOrderDto } from '@/domain/entities/Order';

/**
 * Hook for managing Google Maps directions and markers
 * @param trackData The tracking data from the useTrackOrder hook
 */
export const useMapDirections = (trackData: TrackOrderDto | null) => {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  
  // Track if directions service has been called to avoid multiple calls
  const directionsRequested = useRef(false);

  // Extract business and consumer locations from order data
  const sourceLocation = useMemo(() => {
    return trackData?.order?.business?.location || null;
  }, [trackData]);

  const destinationLocation = useMemo(() => {
    return trackData?.order?.consumer?.location || null;
  }, [trackData]);

  const driverLocation = useMemo(() => {
    return trackData?.driver?.location || null;
  }, [trackData]);

  // Reset directions requested flag when trackData changes significantly
  useEffect(() => {
    if (trackData && sourceLocation && destinationLocation) {
      directionsRequested.current = false;
    }
  }, [
    trackData,
    sourceLocation?.latitude,
    sourceLocation?.longitude,
    destinationLocation?.latitude,
    destinationLocation?.longitude
  ]);

  // Helper function to get LatLng from location object
  const getLatLng = useCallback((location: { latitude: number, longitude: number } | null) => {
    return location ? { lat: location.latitude, lng: location.longitude } : { lat: 0, lng: 0 };
  }, []);

  // Get directions when tracking data is available
  const directionsCallback = useCallback((result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (result !== null && status === 'OK') {
      setDirections(result);
      // Mark that we've successfully requested directions
      directionsRequested.current = true;
    } else {
      console.error('Directions request failed:', status);
    }
  }, []);

  // Map settings
  // Center map on driver if available, otherwise on destination
  const defaultMapCenter = useMemo(() => {
    if (driverLocation) {
      return { lat: driverLocation.latitude, lng: driverLocation.longitude };
    } else if (destinationLocation) {
      return { lat: destinationLocation.latitude, lng: destinationLocation.longitude };
    } else if (sourceLocation) {
      return { lat: sourceLocation.latitude, lng: sourceLocation.longitude };
    } else {
      return { lat: 9.0222, lng: 38.7468 }; // Default to Addis Ababa
    }
  }, [driverLocation, destinationLocation, sourceLocation]);

  const defaultMapZoom = 14;

  const defaultMapOptions = useMemo(() => ({
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
    clickableIcons: false,
  }), []);

  // Set up directions service options when tracking data is available
  const directionsServiceOptions = useMemo(() => {
    if (!sourceLocation || !destinationLocation) return null;

    return {
      origin: getLatLng(sourceLocation),
      destination: getLatLng(destinationLocation),
      travelMode: google.maps.TravelMode.DRIVING,
    } as google.maps.DirectionsRequest;
  }, [sourceLocation, destinationLocation, getLatLng]);

  // Set up directions renderer options
  const directionsRendererOptions = useMemo(() => {
    return directions ? {
      directions,
      options: {
        polylineOptions: {
          strokeColor: '#3B82F6',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
        suppressMarkers: true, // We'll add our own custom markers
      },
    } : null;
  }, [directions]);

  // Custom marker icons
  const markerIcons = useMemo(() => ({
    shop: {
      url: '/images/shop-marker.svg',
      scaledSize: typeof google !== 'undefined' ? new google.maps.Size(40, 40) : null,
    },
    driver: {
      url: '/images/delivery-marker.svg',
      scaledSize: typeof google !== 'undefined' ? new google.maps.Size(40, 40) : null,
    },
    destination: {
      url: '/images/destination-marker.svg',
      scaledSize: typeof google !== 'undefined' ? new google.maps.Size(40, 40) : null,
    },
  }), []);

  return {
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
  };
}; 