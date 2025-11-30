'use client'
import { Button } from "@heroui/react";
import { useAuth } from "../context/auth-context";
import { PlusCircle } from "lucide-react";

export const AdminToolbar = () => {
  const { user } = useAuth();

  if (!user || !user.roles?.includes('Admin')) {
    return null;
  }

  return (
    <div className="mb-6 flex justify-end">
      <Button 
        color="success" 
        variant="shadow"
        className="font-bold text-white"
        startContent={<PlusCircle size={20} />}
        onPress={() => alert("Aquí abriremos el formulario para crear viaje (Próximo paso)")}
      >
        Crear Nuevo Viaje
      </Button>
    </div>
  );
};