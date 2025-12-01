'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, 
  Select, SelectItem, Input, DatePicker 
} from "@heroui/react";
import { toast } from "sonner";
import { API_URL } from "@/constants";
import { parseAbsoluteToLocal, ZonedDateTime } from "@internationalized/date";

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripToEdit?: any; // Si viene, es edición. Si es null, es creación.
}

export const TripModal = ({ isOpen, onClose, tripToEdit }: TripModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Listas para los Selects
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);

  // Form Data
  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");
  // Fecha inicial (hoy) o la del viaje a editar
  const [date, setDate] = useState<ZonedDateTime | null>(
    tripToEdit 
      ? parseAbsoluteToLocal(tripToEdit.tripDepartureDate) 
      : parseAbsoluteToLocal(new Date().toISOString())
  );

  // 1. Cargar Catálogos (Rutas y Buses) al abrir
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
          const [resRoutes, resBuses] = await Promise.all([
            fetch(`${API_URL}/routes`, { headers: { 'Authorization': `Bearer ${token}` } }),
            fetch(`${API_URL}/buses`, { headers: { 'Authorization': `Bearer ${token}` } })
          ]);
          
          if(resRoutes.ok) setRoutes(await resRoutes.json());
          if(resBuses.ok) setBuses(await resBuses.json());
        } catch (e) {
          toast.error("Error cargando rutas/buses");
        }
      };
      fetchData();

      // Si es edición, pre-llenar datos
      if (tripToEdit) {
        setRouteId(tripToEdit.route?.routeId || tripToEdit.route?.id);
        setBusId(tripToEdit.bus?.busId || tripToEdit.bus?.id);
        // La fecha ya se setea en el useState inicial
      }
    }
  }, [isOpen, tripToEdit]);

  // 2. Guardar (Create o Update)
  const handleSave = async () => {
    if (!routeId || !busId || !date) {
      toast.warning("Completa todos los campos");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    
    // Preparar Payload con TUS nombres de variables
    const payload = {
      routeId,
      busId,
      tripDepartureDate: date!.toDate().toISOString(), // Convertir a ISO
      
    };

    try {
      const url = tripToEdit 
        ? `${API_URL}/trips/${tripToEdit.tripId}` // PATCH
        : `${API_URL}/trips`;                     // POST
      
      const method = tripToEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Error al guardar");

      toast.success(tripToEdit ? "Viaje actualizado" : "Viaje creado exitosamente");
      router.refresh(); // Recargar datos en pantalla
      onClose();        // Cerrar modal

    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el viaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" backdrop="blur" classNames={{ base: "bg-zinc-900 text-white border border-zinc-800" }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {tripToEdit ? "Editar Viaje" : "Programar Nuevo Viaje"}
            </ModalHeader>
            <ModalBody>
              {/* SELECT DE RUTA */}
              <Select 
                label="Seleccionar Ruta" 
                placeholder="Origen -> Destino"
                selectedKeys={routeId ? [routeId] : []}
                onChange={(e) => setRouteId(e.target.value)}
                variant="bordered"
                classNames={{ trigger: "bg-zinc-800 border-zinc-700", value: "text-white" }}
              >
                {routes.map((r: any) => (
                  <SelectItem key={r.routeId || r.id} textValue={`${r.origin?.locationName} -> ${r.destination?.locationName}`}>
                    {r.origin?.locationName} ➝ {r.destination?.locationName} (${r.routeBasePrice})
                  </SelectItem>
                ))}
              </Select>

              {/* SELECT DE BUS */}
              <Select 
                label="Asignar Autobús" 
                placeholder="Placa y Capacidad"
                selectedKeys={busId ? [busId] : []}
                onChange={(e) => setBusId(e.target.value)}
                variant="bordered"
                classNames={{ trigger: "bg-zinc-800 border-zinc-700", value: "text-white" }}
              >
                {buses.map((b: any) => (
                  <SelectItem key={b.busId || b.id} textValue={b.busPlateNumber || b.plateNumber}>
                    {b.busPlateNumber || b.plateNumber} (Cap: {b.busCapacity || b.capacity})
                  </SelectItem>
                ))}
              </Select>

              {/* SELECTOR DE FECHA */}
              <DatePicker 
                label="Fecha y Hora de Salida" 
                variant="bordered" 
                hideTimeZone 
                showMonthAndYearPickers 
                defaultValue={date}
                onChange={(value) => setDate(value)}
                className="text-white dark"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>Cancelar</Button>
              <Button color="primary" onPress={handleSave} isLoading={loading}>
                {tripToEdit ? "Guardar Cambios" : "Crear Viaje"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};