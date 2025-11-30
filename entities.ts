
export interface User {
    userId: string
    userFullName:string
    userEmail:string
    userPassword?: string
    roles?: string[]
    isActive:boolean
    indetifyDocumentUrl: string
    createdAt: Date
    updatedAt: Date
    ticket: Ticket[]
  }
  
  export interface Location {
    id: number;
    name: string;
  }
  
  export interface Route {
    id: string;
    origin: Location;
    destination: Location;
    basePrice: number; 
    estimatedDuration: number;
  }
  
  export interface Bus {
    id: string;
    plateNumber: string;
    capacity: number;
  }
  
  export interface Trip {
    tripId: string
    tripDepartureDate: Date
    tripStatus: 'SCHEDULED' | 'ON_GOING' | 'COMPLETED' | 'CANCELLED'
    route: Route
    bus: Bus
    ticket: Ticket[]
  }
  
  export interface Ticket {
    ticketId: string
    ticketSeatNumber: number
    ticketStatus: 'RESERVED' | 'PAID' | 'CANCELLED'
    trip: Trip
    user: User;
  }
  
export interface Locations {
    locationId: number
    locationName: string
    departingRoutes: Route[]
    arrivingRoutes: Route[]
}

  export interface LoginResponse {
    access_token: string;
    user: User;
  }