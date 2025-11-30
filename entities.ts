
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
  

  export interface Route {
    routeId: string
    routeBasePrice: number;
    routeEstimateDuration: number
    origin: Locations
    destination: Locations
    trip: Trip[]
  }
  
  export interface Bus {
    busId: string
    busPlateNumber: string
    busCapacity: number
    trip:Trip[]
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