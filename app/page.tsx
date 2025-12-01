import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BuyTicketButton } from "./components/buy-button";
import { AdminToolbar } from "./components/admin-toolbar";
import { API_URL } from "@/constants";
import { TripActions } from "./components/trip-action";

const formatDate = (dateString: Date | string) => {
  if (!dateString) return "Fecha pendiente";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Fecha inválida";
  return date.toLocaleString('es-MX', { 
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
};

async function getTrips() {
  try {

    const res = await fetch(`${API_URL}/trips?t=${new Date().getTime()}`, {
      cache: 'no-store', 
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Home() {
  const trips = await getTrips();

  return (
    <main className="container mx-auto p-4 md:p-10 min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Próximos Viajes
          </h1>
          <p className="text-zinc-400">Reserva tu lugar ahora mismo</p>
        </div>
        <AdminToolbar /> 
      </div>

      {trips.length === 0 ? (
        <div className="text-center text-zinc-500 mt-20 p-10 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-lg">No hay viajes disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => (
            <Card 
              key={trip.tripId} 
              className="bg-zinc-900 border border-zinc-800 text-white hover:border-primary/50 transition-all shadow-lg flex flex-col min-h-[350px]"
            >
              <TripActions trip={trip} />
              <div className="flex-grow">
                <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
                  <div className="flex justify-between w-full items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <p className="text-xs font-bold text-green-500 uppercase tracking-widest">
                        {trip.tripStatus}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-2xl font-bold text-white leading-tight mb-2">
                    {trip.route.origin.locationName} 
                    <span className="text-zinc-500 mx-2">➝</span> 
                    {trip.route.destination.locationName}
                  </p>
                  
                  <div className="inline-block bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                    <p className="text-zinc-300 text-sm flex items-center gap-2">
                      📅 {formatDate(trip.tripDepartureDate)}
                    </p>
                  </div>
                </CardHeader>
                
                <CardBody className="px-6 py-4">
                  <div className="flex justify-between items-end bg-black/20 p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Precio por boleto</span>
                      <span className="text-3xl font-bold text-primary">
                        ${Number(trip.route.routeBasePrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Unidad</span>
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700 font-mono">
                        {trip.bus.busPlateNumber}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </div>
              <div className="mt-auto">
                 <Divider className="bg-zinc-800" />
                 <div className="p-6">
                    <BuyTicketButton tripId={trip.tripId} />
                 </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}