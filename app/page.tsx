import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { BuyTicketButton } from "./_components/buy-button";
import { API_URL } from "@/constants";
import { BusFront } from "lucide-react";

async function getTrips() {
  try {
  
    const res = await fetch(`${API_URL}/trips`, {
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
      <h1 className="text-4xl font-bold text-white mb-2 text-center">
        Próximos Viajes
      </h1>
      <p className="text-gray-400 text-center mb-10">Reserva tu lugar ahora mismo</p>

      {trips.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>No hay viajes disponibles o no se pudo conectar al servidor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => (
            <Card key={trip.tripId} className="bg-zinc-900 border border-zinc-800 text-white hover:border-blue-500/50 transition-all">
              <CardHeader className="flex flex-col items-start px-6 pt-6 pb-0">
                <p className="text-lg font-bold uppercase tracking-wider text-blue-400">
                  {trip.route?.origin?.name} <BusFront className="mr-2 text-blue-500" /> {trip.route?.destination?.name}
                </p>
                <small className="text-gray-400 mt-1">
                  {new Date(trip.tripDepartureDate).toLocaleString()}
                </small>
              </CardHeader>
              
              <CardBody className="px-6 py-4">
                <div className="flex justify-between items-end mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase">Precio</span>
                    <span className="text-2xl font-bold text-green-400">${trip.route?.routeBasePrice}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500 uppercase">Autobús</span>
                    <span className="text-sm bg-zinc-800 px-2 py-1 rounded">{trip.bus?.busPlateNumber}</span>
                  </div>
                </div>

                <Divider className="my-3 bg-zinc-700" />
                
                {/* Aquí usamos el botón de Cliente */}
                <BuyTicketButton tripId={trip.id} />
                
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}