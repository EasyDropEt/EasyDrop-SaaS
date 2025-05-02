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

/**
 * @deprecated This interface is being deprecated in favor of the OTP-based authentication flow.
 * Use BusinessLoginCredentials and BusinessVerifyCredentials instead.
 */
export interface BusinessCredentials {
    email: string;
    password: string;
}

export interface BusinessLoginCredentials {
    email: string;
}

export interface BusinessVerifyCredentials {
    email: string;
    otp: string;
}

export interface BusinessRegistration extends Omit<Business, 'id'> {
    // Removed password fields as they're not needed in OTP-based auth
}