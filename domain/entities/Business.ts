import { Location } from "./Location";

export interface Business {
    id: string
    business_name: string;
    owner_first_name: string;
    owner_last_name: string;
    email: string;
    phone_number: string;
    location: Location
}