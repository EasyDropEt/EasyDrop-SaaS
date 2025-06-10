export interface Consumer {
    id: string
    name?: string 
    phone_number: string 
    email: string 
    active_status: boolean
    notification_ids:{
        items: string[]
    }
    
    // API response fields
    first_name?: string
    last_name?: string
    location?: {
        address: string
        latitude: number
        longitude: number
        postal_code: string
        city: string
    }
}