export interface Consumer {
    id: string
    name: string 
    phone_number: string 
    email: string 
    active_status: boolean
    notification_ids:{
        items: string[]
    }
}