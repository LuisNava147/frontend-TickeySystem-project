import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BuyTicketButton } from "./_components/buy-button";


async function getTrips() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trips`, {
      cache: 'no-store', 
    });

    if (!res.ok) return [];
    
    return await res.json();
  } catch (error) {
    console.error("Error al conectar con el backend:", error);
    return [];
  }
}

export default async function Home() {
  const trips = await getTrips();

  return (
    <main className="container mx-auto p-4 md:p-10 min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-2 text-center">
        Próximos Viajes 🚍
      </h1>
      <p className="text-zinc-400 text-center mb-10">Reserva tu lugar ahora mismo</p>

      {trips.length === 0 ? (
        <div className="text-center text-zinc-500 mt-20 p-10 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-lg">No hay viajes disponibles por el momento.</p>
          <p className="text-sm mt-2">Intenta recargar la página o revisa tu conexión.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => {
            
            const tripId = trip.tripId || trip.id;
            const departureDate = trip.tripDepartureDate || trip.departureDate;
            const price = trip.route?.routeBasePrice || trip.route?.basePrice || 0;
            const busPlate = trip.bus?.busPlateNumber || trip.bus?.plateNumber || "N/A";
            
            const dateObj = new Date(departureDate);
            const formattedDate = isNaN(dateObj.getTime()) 
              ? "Fecha pendiente" 
              : dateObj.toLocaleString('es-MX', { 
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
                  hour: '2-digit', minute: '2-digit' 
                });

            return (
              <Card key={tripId} className="bg-zinc-900 border border-zinc-800 text-white hover:border-primary/50 transition-all shadow-lg hover:shadow-primary/10">
                <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
                  <div className="flex items-center gap-2 mb-2 w-full">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest">
                      {trip.tripStatus || trip.status || "DISPONIBLE"}
                    </p>
                  </div>
                  
                  <p className="text-xl font-bold text-white leading-tight">
                    {trip.route?.origin?.name || "Origen"} 
                    <span className="text-zinc-500 mx-2">➝</span> 
                    {trip.route?.destination?.name || "Destino"}
                  </p>
                  
                  <p className="text-zinc-400 text-sm mt-2 flex items-center gap-1">
                    📅 {formattedDate}
                  </p>
                </CardHeader>
                
                <CardBody className="px-6 py-4">
                  <div className="flex justify-between items-end mb-4 bg-black/20 p-3 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Precio</span>
                      <span className="text-2xl font-bold text-green-400">
                        ${Number(price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Autobús</span>
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700 font-mono">
                        {busPlate}
                      </span>
                    </div>
                  </div>

                  <Divider className="my-3 bg-zinc-800" />
                  <BuyTicketButton tripId={tripId} />
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}