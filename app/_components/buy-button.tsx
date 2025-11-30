'use client'

import { Button } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants";

export const BuyTicketButton = ({ tripId }: { tripId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
    // 1. Obtener token y usuario del storage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      alert("Por favor inicia sesión para comprar");
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    const seat = prompt("¿Qué número de asiento quieres? (Ej: 5)");
    if (!seat) return;

    setLoading(true);

    try {
      // 2. Petición al Backend
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // <--- Aquí va el token
        },
        body: JSON.stringify({
          tripId: tripId,
          userId: user.id, // O user.userId dependiendo de tu backend
          ticketSeatNumber: parseInt(seat)
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      alert("¡Compra exitosa!  Revisa 'Mis Boletos'");
      
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      color="primary" 
      variant="shadow" 
      className="w-full mt-4 font-bold"
      isLoading={loading}
      onPress={handleBuy}
    >
      Comprar Boleto
    </Button>
  );
};