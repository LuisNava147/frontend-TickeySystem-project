'use client'

import { 
  Button, 
  Tooltip, 
  useDisclosure, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter 
} from "@heroui/react";
import { Pencil, Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "../admin/auth-context";
import { TripModal } from "./trip-modal";
import { API_URL } from "@/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const TripActions = ({ trip }: { trip: any }) => {
  const { user } = useAuth();
  const router = useRouter();
  
  // Hook para controlar el modal de EDICIÓN
  const { 
    isOpen: isEditOpen, 
    onOpen: onEditOpen, 
    onClose: onEditClose 
  } = useDisclosure();

  // Hook para controlar el modal de ELIMINAR (Nuevo)
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onClose: onDeleteClose 
  } = useDisclosure();

  const [loading, setLoading] = useState(false);

  // Si no es admin, no renderizamos nada
  if (!user || !user.roles?.includes('Admin')) return null;

  const handleDeleteConfirm = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/trips/${trip.tripId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if(res.ok) {
        toast.success("Viaje eliminado correctamente");
        router.refresh();
        onDeleteClose(); // Cerramos el modal
      } else {
        const errorData = await res.json();
        // Si hay tickets asociados, el backend probablemente lo impida
        toast.error("No se pudo eliminar", {
            description: errorData.message || "Es posible que este viaje ya tenga boletos vendidos."
        });
      }
    } catch(e) { 
        console.error(e);
        toast.error("Error de conexión");
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* --- BOTONES FLOTANTES --- */}
      <div className="flex gap-2 absolute top-4 right-4 z-20">
        <Tooltip content="Editar Viaje" className="text-black bg-white">
          <Button isIconOnly size="sm" variant="flat" className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/40" onPress={onEditOpen}>
            <Pencil size={16} />
          </Button>
        </Tooltip>
        
        <Tooltip content="Eliminar Viaje" color="danger">
          <Button isIconOnly size="sm" variant="flat" className="bg-red-500/20 text-red-400 hover:bg-red-500/40" onPress={onDeleteOpen}>
            <Trash2 size={16} />
          </Button>
        </Tooltip>
      </div>

      {/* --- MODAL DE EDICIÓN --- */}
      <TripModal isOpen={isEditOpen} onClose={onEditClose} tripToEdit={trip} />

      {/* --- MODAL DE CONFIRMACIÓN DE BORRADO (NUEVO) --- */}
      <Modal 
        isOpen={isDeleteOpen} 
        onOpenChange={onDeleteClose} 
        backdrop="blur"
        classNames={{
          base: "bg-zinc-900 border border-zinc-800 text-white",
          header: "border-b border-zinc-800",
          footer: "border-t border-zinc-800",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                <div className="p-3 rounded-full bg-red-500/20 text-red-500 mb-2">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold">¿Eliminar este viaje?</h3>
              </ModalHeader>
              
              <ModalBody className="text-center pb-6">
                <p className="text-zinc-400">
                  Estás a punto de borrar el viaje de 
                  <span className="text-white font-bold mx-1">
                    {trip.route?.origin?.locationName} a {trip.route?.destination?.locationName}
                  </span>.
                </p>
                <p className="text-xs text-red-400 mt-2 bg-red-950/30 p-2 rounded border border-red-900/50">
                  ⚠️ Precaución: Si ya hay boletos vendidos para este viaje, el sistema podría impedir la eliminación por seguridad.
                </p>
              </ModalBody>
              
              <ModalFooter className="justify-center gap-4 pb-6">
                <Button variant="flat" onPress={onClose} className="text-zinc-300 hover:text-white">
                  Cancelar
                </Button>
                <Button 
                  color="danger" 
                  onPress={handleDeleteConfirm} 
                  isLoading={loading}
                  className="font-bold shadow-lg shadow-red-500/20"
                >
                  Sí, Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};