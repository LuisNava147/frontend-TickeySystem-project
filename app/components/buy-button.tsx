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
import { toast } from "sonner"; // Usamos Toast en vez de Alert
import { API_URL } from "@/constants";

export const BuyTicketButton = ({ tripId }: { tripId: string }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [seat, setSeat] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Abrir el Modal (Verificando login)
  const handleOpen = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.info("Inicia sesión para comprar");
      router.push('/login'); 
      return;
    }
    
    // Limpiamos el estado y abrimos
    setSeat("");
    onOpen();
  };

  // 2. Confirmar Compra (Llamada al API)
  const handleConfirmPurchase = async () => {
    if (!seat) {
      toast.warning("Por favor escribe un número de asiento");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    // Obtenemos el usuario para sacar su ID
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tripId: tripId,
          // Usamos tus nombres de variables personalizados
          userId: user?.userId || user?.id, 
          ticketSeatNumber: parseInt(seat)
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al comprar");
      }

      // ÉXITO
      onClose(); // Cerramos modal
      toast.success("¡Compra Exitosa! ", {
        description: `Asiento #${seat} reservado. Revisa 'Mis Boletos'.`
      });
      router.refresh();

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "No se pudo completar la compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón Visible en la Tarjeta */}
      <Button 
        color="primary" 
        variant="shadow" 
        className="w-full mt-auto font-bold"
        onPress={handleOpen}
      >
        Comprar Boleto
      </Button>

      {/* Modal de Selección de Asiento */}
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
                  // Estilos para que no se ponga blanco feo
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