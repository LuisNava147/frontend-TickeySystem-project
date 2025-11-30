'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button, Spinner, Chip } from "@heroui/react";
import { TicketCheck, Calendar, Armchair, Bus } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/constants";

const formatDate = (dateString: string) => {
  if (!dateString) return "Fecha pendiente";
  const date = new Date(dateString);
  return date.toLocaleString('es-MX', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
      
        const res = await fetch(`${API_URL}/tickets/mine`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        } else {
          toast.error("Error al cargar tus boletos");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Spinner size="lg" color="primary" label="Cargando tus viajes..." />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-10 min-h-screen pt-24">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <TicketCheck className="text-primary" size={32} />
          Mis Boletos
        </h1>
        <p className="text-zinc-400">Historial de tus próximas aventuras.</p>
      </div>

      {tickets.length === 0 ? (
        <Card className="bg-zinc-900/50 border border-zinc-800 p-10 text-center max-w-lg mx-auto mt-10">
          <CardBody className="flex flex-col items-center gap-4">
            <div className="bg-zinc-800 p-4 rounded-full">
              <Bus size={48} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white">Aún no tienes viajes</h3>
            <p className="text-zinc-400">¡Es hora de planear tu próxima escapada!</p>
            <Button 
              color="primary" 
              variant="shadow" 
              onPress={() => router.push('/')}
              className="mt-2 font-bold"
            >
              Buscar Viajes
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-6">
          {tickets.map((ticket: any) => {
            const status = ticket.ticketStatus || ticket.status;
            const origin = ticket.trip?.route?.origin?.locationName;
            const destination = ticket.trip?.route?.destination?.locationName;
            const date = ticket.trip?.tripDepartureDate;
            const busPlate = ticket.trip?.bus?.busPlateNumber;
            const seat = ticket.ticketSeatNumber || ticket.seatNumber;

            return (
              <Card 
                key={ticket.ticketId} 
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all w-full group shadow-lg"
              >
                <CardBody className="p-0 sm:flex-row flex-col flex overflow-hidden">
                  
                  <div className="p-6 flex-1 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-zinc-800 relative">
                    <div className="flex justify-between items-start mb-4">
                      <Chip 
                        color={status === 'RESERVED' ? "success" : "danger"} 
                        variant="flat" 
                        size="sm"
                        className="uppercase font-bold tracking-wider"
                      >
                        {status}
                      </Chip>
                      <span className="text-[10px] text-zinc-600 font-mono">ID: {ticket.ticketId?.slice(0,8)}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-2xl sm:text-3xl font-bold text-white">
                        {origin}
                      </div>
                      <div className="flex-1 border-t-2 border-dashed border-zinc-700 relative top-1 mx-2"></div>
                      <div className="text-2xl sm:text-3xl font-bold text-white text-right">
                        {destination}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-300 mt-2 bg-zinc-950/50 w-fit px-3 py-2 rounded-lg border border-zinc-800">
                      <Calendar size={18} className="text-primary" />
                      <span className="text-sm font-medium capitalize">
                        {formatDate(date)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:w-72 bg-zinc-950/30 flex flex-col justify-center gap-4 relative">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Bus size={16} />
                        <span className="text-xs uppercase font-bold tracking-wider">Unidad</span>
                      </div>
                      <span className="font-mono text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded text-xs border border-zinc-700">
                        {busPlate}
                      </span>
                    </div>

                    <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-1">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Armchair size={20} />
                        <span className="text-xs uppercase font-bold tracking-wider">Asiento</span>
                      </div>
                      <span className="text-5xl font-bold text-white">
                        {seat}
                      </span>
                    </div>
                  </div>

                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}