'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Ticket, MapPin, Bus, Waypoints, ShieldCheck } from "lucide-react";
import { useAuth } from "@/app/admin/auth-context";

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Si termina de cargar y no es admin, fuera.
    if (!isLoading && (!user || !user.roles?.includes('Admin'))) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading) return null; // Evita parpadeos

  // Configuración de las tarjetas del menú
  const menuItems = [
    {
      title: "Panel de Tickets",
      desc: "Gestionar reservas, cancelaciones y ver todos los boletos.",
      icon: <Ticket size={48} className="text-blue-500" />,
      href: "/admin/tickets",
      color: "hover:border-blue-500/50"
    },
    {
      title: "Rutas",
      desc: "Conectar orígenes y destinos, establecer precios.",
      icon: <Waypoints size={48} className="text-purple-500" />,
      href: "/admin/routes",
      color: "hover:border-purple-500/50"
    },
    {
      title: "Autobuses",
      desc: "Administrar la flotilla, placas y capacidades.",
      icon: <Bus size={48} className="text-yellow-500" />,
      href: "/admin/buses",
      color: "hover:border-yellow-500/50"
    },
    {
      title: "Ubicaciones",
      desc: "Agregar o quitar ciudades y estados disponibles.",
      icon: <MapPin size={48} className="text-green-500" />,
      href: "/admin/locations",
      color: "hover:border-green-500/50"
    }
  ];

  return (
    <main className="container mx-auto p-6 min-h-screen pt-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-zinc-800 rounded-full text-white">
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          <p className="text-zinc-400">Bienvenido, {user?.userFullName}. ¿Qué deseas gestionar hoy?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Card 
            key={item.title} 
            isPressable
            onPress={() => router.push(item.href)}
            className={`bg-zinc-900 border border-zinc-800 text-white shadow-xl transition-all h-full p-4 ${item.color} group`}
          >
            <CardHeader className="flex gap-4 items-center">
              <div className="p-4 bg-zinc-950 rounded-2xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-bold group-hover:text-white transition-colors">{item.title}</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-zinc-400 text-sm">
                {item.desc}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}