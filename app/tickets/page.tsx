'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Divider, Button, Spinner } from "@heroui/react";
import { TicketCheck } from "lucide-react";
import { API_URL } from "@/constants";
import { BusFront } from "lucide-react";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
    
      if (!token) {
        router.push('/auth/login');
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
          console.error("Error al obtener tickets");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-10 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
        <TicketCheck className="text-blue-500" /> Mis Boletos
      </h1>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>Aún no has comprado boletos.</p>
          <Button color="primary" variant="flat" className="mt-4" onPress={() => router.push('/')}>
            Ir a comprar uno
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket: any) => (
            <Card key={ticket.id || ticket.ticketId} className="bg-zinc-900 border border-zinc-800 text-white w-full">
              <CardHeader className="flex justify-between items-start bg-zinc-800/50 p-4">
                <div>
                  <p className="font-bold text-lg text-blue-400">
                    {ticket.trip?.route?.origin?.name} <BusFront className="mr-2 text-blue-500" /> {ticket.trip?.route?.destination?.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(ticket.trip?.tripDepartureDate).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-600 px-3 py-1 rounded text-xs font-bold uppercase">
                  {ticket.status || ticket.ticketStatus}
                </div>
              </CardHeader>
              <Divider className="bg-zinc-700" />
              <CardBody className="p-4 flex flex-row justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pasajero</p>
                  <p className="text-sm font-semibold">{ticket.user?.userFullName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Asiento</p>
                  <p className="text-4xl font-bold text-white">{ticket.ticketSeatNumber}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}