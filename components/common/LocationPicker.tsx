'use client';

// @ts-nocheck
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import React, { useCallback, useRef, useState } from 'react';
import { Loader } from './Loader';

export interface SelectedLocation {
  address: string;
  city: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface Props {
  onSelect: (loc: SelectedLocation) => void;
}

const containerStyle = {
  width: '100%',
  height: '350px',
};

export const LocationPicker: React.FC<Props> = ({ onSelect }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const autoRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      reverseGeocode(lat, lng);
    }
  };

  const onAutoLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autoRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autoRef.current?.getPlace();
    if (!place || !place.geometry) return;

    const lat = place.geometry.location?.lat();
    const lng = place.geometry.location?.lng();

    if (lat && lng) {
      setPosition({ lat, lng });
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(14);
      parseAddress(place, lat, lng);
    }
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setLoading(false);
      if (status === 'OK' && results && results[0]) {
        parseAddress(results[0], lat, lng);
      }
    });
  };

  const parseAddress = (
    place: google.maps.places.PlaceResult | google.maps.GeocoderResult,
    lat: number,
    lng: number
  ) => {
    const addressComponents = place.address_components || [];
    const getComponent = (types: string[]) =>
      addressComponents.find((c) => types.every((t) => c.types.includes(t)))?.long_name || '';

    const city = getComponent(['locality']) || getComponent(['administrative_area_level_1']);
    const country = getComponent(['country']);
    const postalCode = getComponent(['postal_code']);
    const address = place.formatted_address || '';
    setSelectedAddress(address);

    onSelect({ address, city, country, postal_code: postalCode, latitude: lat, longitude: lng });
  };

  return (
    <div className="space-y-4">
      <Autocomplete onLoad={onAutoLoad} onPlaceChanged={onPlaceChanged}>
        <input className="input w-full" placeholder="Search location" />
      </Autocomplete>
      {selectedAddress && (
        <div className="flex items-center space-x-2 bg-light-50 dark:bg-dark-700 px-3 py-2 rounded-md shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-primary-600 dark:text-primary-400"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-4.556 0-8.25 3.694-8.25 8.25 0 5.25 8.25 11.25 8.25 11.25s8.25-6 8.25-11.25c0-4.556-3.694-8.25-8.25-8.25zm0 10.5a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold text-dark-700 dark:text-light-300 truncate">
            {selectedAddress}
          </span>
        </div>
      )}
      {loading && <Loader />}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || { lat: 9.03, lng: 38.74 }}
        zoom={position ? 13 : 6}
        onLoad={onMapLoad}
        onClick={onMapClick}
        options={{ streetViewControl: false, mapTypeControl: false }}
      >
        {position && <Marker position={position} />}
      </GoogleMap>
    </div>
  );
}; 