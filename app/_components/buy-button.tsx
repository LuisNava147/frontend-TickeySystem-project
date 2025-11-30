'use client'

import { 
  Button, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useDisclosure, 
  Input 
} from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TicketCheck } from "lucide-react"; 
import { API_URL } from "@/constants";
import { toast } from "sonner"; 

export const BuyTicketButton = ({ tripId }: { tripId: string }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [seat, setSeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOpen = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Usamos un toast informativo en lugar de alert
      toast.info("Inicia sesión para continuar", {
        description: "Necesitas una cuenta para comprar boletos."
      });
      router.push('/login'); 
      return;
    }
    setError("");
    setSeat("");
    onOpen();
  };

  const handleConfirmPurchase = async () => {
    if (!seat) {
      setError("Por favor escribe un número de asiento");
      return;
    }

    setLoading(true);
    setError("");

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId: tripId,
          userId: user?.userId || user?.id, 
          ticketSeatNumber: parseInt(seat)
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al comprar");
      }

      onClose(); 
      
      toast.success("¡Boleto Comprado!", {
        description: `Asiento #${seat} reservado correctamente.`,
        duration: 6000,
      });
      
      router.refresh();

    } catch (err: any) {
      console.error(err);
      const message = err.message.includes("JSON") ? "Error de conexión" : err.message;
      
  
      toast.error("No se pudo completar la compra", {
        description: message
      });
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        color="primary" 
        variant="shadow" 
        className="w-full mt-auto font-bold"
        onPress={handleOpen}
      >
        Comprar Boleto
      </Button>

      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-zinc-900 border border-zinc-800 text-white shadow-2xl",
          header: "border-b border-zinc-800",
          footer: "border-t border-zinc-800",
          closeButton: "hover:bg-white/10 active:bg-white/20 text-zinc-400 hover:text-white",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <TicketCheck className="text-blue-500" />
                  <span className="text-lg">Selecciona tu Asiento</span>
                </div>
                <p className="text-sm font-normal text-zinc-400">
                  Ingresa el número de asiento que deseas reservar.
                </p>
              </ModalHeader>
              
              <ModalBody className="py-6">
                <Input
                  autoFocus
                  label="Número de Asiento"
                  placeholder="Ej: 5"
                  variant="bordered"
                  type="number"
                  value={seat}
                  onValueChange={setSeat}
                  classNames={{
                    input: "text-white text-2xl font-bold text-center",
                    label: "text-zinc-500 hidden",
                    inputWrapper: [
                      "bg-zinc-950",
                      "border-zinc-700",
                      "h-16",
                      "hover:border-zinc-500",
                      "group-data-[focus=true]:border-blue-500",
                      "group-data-[focus=true]:bg-zinc-950", 
                    ].join(" "),
                  }}
                />

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center animate-pulse">
                    {error}
                  </div>
                )}
              </ModalBody>

              <ModalFooter>
                <Button className="bg-transparent text-zinc-400 hover:text-white" onPress={onClose}>
                  Cancelar
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleConfirmPurchase}
                  isLoading={loading}
                  className="font-bold shadow-lg shadow-blue-500/20"
                >
                  Confirmar Compra
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};