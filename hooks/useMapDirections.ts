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

  // Reset directions requested flag when trackData changes significantly
  useEffect(() => {
    if (trackData) {
      directionsRequested.current = false;
    }
  }, [
    trackData?.source_location.latitude,
    trackData?.source_location.longitude,
    trackData?.destination_location.latitude,
    trackData?.destination_location.longitude
  ]);

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
  // Convert driver location from TrackOrderDto to Google Maps LatLng format
  const defaultMapCenter = useMemo(() => {
    return trackData ? 
      { lat: trackData.driver_location.latitude, lng: trackData.driver_location.longitude } : 
      { lat: 35.8799866, lng: 76.5048004 };
  }, [trackData]);

  const defaultMapZoom = 14;

  const defaultMapOptions = useMemo(() => ({
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    mapTypeId: 'roadmap',
    disableDefaultUI: false,
    clickableIcons: false,
  }), []);

  // Convert our location objects to Google Maps LatLng objects
  const getLatLng = useCallback((location: { latitude: number, longitude: number }) => {
    return { lat: location.latitude, lng: location.longitude };
  }, []);

  // Memoize direction service options
  const directionsServiceOptions = useMemo(() => {
    if (!trackData) return null;
    
    return {
      origin: getLatLng(trackData.source_location),
      destination: getLatLng(trackData.destination_location),
      travelMode: google.maps.TravelMode.DRIVING,
    };
  }, [trackData, getLatLng]);

  // Memoize directions renderer options
  const directionsRendererOptions = useMemo(() => {
    if (!directions) return null;
    
    return {
      directions: directions,
      suppressMarkers: true, // We'll use our own custom markers
      preserveViewport: true, // Important - prevents map from moving on each render
    };
  }, [directions]);

  // Define custom marker icons
  const markerIcons = useMemo(() => {
    return {
      shop: {
        url: '/images/shop-marker.svg',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
      destination: {
        url: '/images/destination-marker.svg',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      },
      driver: {
        url: '/images/delivery-marker.svg',
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      }
    };
  }, []);

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
    markerIcons
  };
}; 