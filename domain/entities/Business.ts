import { Location } from "./Location";

export interface Business {
    id: string;
    business_name: string;
    owner_first_name: string;
    owner_last_name: string;
    email: string;
    phone_number: string;
    location: Location;
    active_status?: boolean;
}

// API DTOs
export interface BusinessDto {
    id: string;
    business_name: string;
    owner_first_name: string;
    owner_last_name: string;
    phone_number: string;
    email: string;
    location: LocationDto;
}

export interface BusinessAccountDto {
    id: string;
    business_name: string;
    owner_first_name: string;
    owner_last_name: string;
    phone_number: string;
    email: string;
    location: LocationDto;
    token: string;
}

export interface LocationDto {
    address: string;
    latitude: number;
    longitude: number;
    postal_code: string;
    city: string;
}

export interface CreateLocationDto {
    address: string;
    postal_code: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface CreateBusinessAccountDto {
    business_name: string;
    owner_first_name: string;
    owner_last_name: string;
    email: string;
    phone_number: string;
    location: CreateLocationDto;
    password: string;
}

export interface LoginBusinessDto {
    phone_number: string;
    password: string;
}

export interface LoginUserVerifyDto {
    user_id: string;
    otp: string;
}

export interface UnverifiedUserDto {
    message: string;
    id: string;
}

/**
 * @deprecated This interface is being deprecated in favor of the OTP-based authentication flow.
 * Use BusinessLoginCredentials and BusinessVerifyCredentials instead.
 */
export interface BusinessCredentials {
    email: string;
    password: string;
}

export interface BusinessLoginCredentials {
    phone_number: string;
    password: string;
}

export interface BusinessVerifyCredentials {
    user_id: string;
    otp: string;
}

export interface BusinessRegistration extends Omit<Business, 'id'> {
    // Added for registration process
    password?: string;
    billing_details?: Record<string, any>[];
}