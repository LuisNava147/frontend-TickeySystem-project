'use client'

import { Button, useDisclosure } from "@heroui/react";
import { useAuth } from "../admin/auth-context";
import { PlusCircle } from "lucide-react";
import { TripModal } from "./trip-modal"; // Importar el modal

export const AdminToolbar = () => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook para abrir/cerrar

  if (!user || !user.roles?.includes('Admin')) return null;

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button 
          color="success" 
          variant="shadow"
          className="font-bold text-white"
          startContent={<PlusCircle size={20} />}
          onPress={onOpen} // Abre el modal
        >
          Crear Nuevo Viaje
        </Button>
      </div>

      {/* Renderizamos el modal aquí (sin tripToEdit = Creación) */}
      <TripModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};