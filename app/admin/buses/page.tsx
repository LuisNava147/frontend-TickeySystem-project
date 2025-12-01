'use client'

import { useEffect, useState } from "react";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Spinner, Tooltip 
} from "@heroui/react";
import { Bus, Plus, Trash2, Pencil, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/constants";

export default function AdminBusesPage() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  
  // Estado para saber si estamos editando
  const [busToEdit, setBusToEdit] = useState<any>(null);

  // Form Data
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState("");
  const [saving, setSaving] = useState(false);

  // 1. Cargar Autobuses
  const fetchBuses = async () => {
    try {
      const res = await fetch(`${API_URL}/buses`);
      if (res.ok) setBuses(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBuses(); }, []);

  // 2. Abrir Modal para CREAR
  const openCreateModal = () => {
    setBusToEdit(null); // Limpiamos modo edición
    setPlate("");
    setCapacity("");
    onOpen();
  };

  // 3. Abrir Modal para EDITAR
  const openEditModal = (bus: any) => {
    setBusToEdit(bus); // Guardamos el bus a editar
    // Llenamos el formulario con los datos actuales
    setPlate(bus.busPlateNumber || bus.plateNumber);
    setCapacity(bus.busCapacity || bus.capacity);
    onOpen();
  };

  // 4. Guardar (POST o PATCH)
  const handleSave = async () => {
    if (!plate || !capacity) return toast.warning("Llena todos los campos");
    
    setSaving(true);
    const token = localStorage.getItem('token');

    try {
      // Si hay busToEdit, usamos su ID para el PATCH. Si no, usamos la URL base para POST.
      const url = busToEdit 
        ? `${API_URL}/buses/${busToEdit.busId || busToEdit.id}` 
        : `${API_URL}/buses`;
      
      const method = busToEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        // El backend espera 'plateNumber' y 'capacity'
        body: JSON.stringify({ 
            busPlateNumber: plate, 
            busCapacity: parseInt(capacity) 
        })
      });

      if (res.ok) {
        toast.success(busToEdit ? "Autobús actualizado" : "Autobús registrado");
        fetchBuses();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Error al guardar");
      }
    } catch (error) { toast.error("Error de conexión"); }
    finally { setSaving(false); }
  };

  // 5. Eliminar
  const handleDelete = async (id: string) => {
    if(!confirm("¿Eliminar autobús?")) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/buses/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) { toast.success("Eliminado"); fetchBuses(); }
        else toast.error("No se puede eliminar (Tiene viajes asignados)");
    } catch(e) {}
  };

  return (
    <main className="container mx-auto p-6 min-h-screen pt-24">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Bus className="text-primary" /> Autobuses
            </h1>
            <p className="text-zinc-400 text-sm">Gestión de la flotilla.</p>
        </div>
        <div className="flex gap-2">
            <Button isIconOnly variant="flat" onPress={() => fetchBuses()}><RefreshCcw size={18}/></Button>
            {/* Botón Nueva Ruta usa openCreateModal */}
            <Button color="primary" onPress={openCreateModal} startContent={<Plus />}>Nuevo Autobús</Button>
        </div>
      </div>

      <Table aria-label="Buses Table" classNames={{ wrapper: "bg-zinc-900 border border-zinc-800 shadow-xl", th: "bg-zinc-950 text-zinc-400" }}>
        <TableHeader>
          <TableColumn>PLACA</TableColumn>
          <TableColumn>CAPACIDAD</TableColumn>
          <TableColumn align="center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody items={buses} isLoading={loading} loadingContent={<Spinner color="primary"/>} emptyContent="Sin autobuses">
          {(item: any) => (
            <TableRow key={item.busId || item.id}>
              <TableCell className="font-mono text-white text-lg font-bold">{item.busPlateNumber || item.plateNumber}</TableCell>
              <TableCell className="text-zinc-300">
                <span className="bg-zinc-800 px-2 py-1 rounded text-sm border border-zinc-700">
                    {item.busCapacity || item.capacity} pasajeros
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-3">
                    {/* Botón EDITAR */}
                    <Tooltip content="Editar" className="text-black">
                        <span 
                            className="text-lg text-blue-400 cursor-pointer hover:text-blue-300 transition active:scale-95" 
                            onClick={() => openEditModal(item)}
                        >
                            <Pencil size={18} />
                        </span>
                    </Tooltip>

                    {/* Botón ELIMINAR */}
                    <Tooltip content="Eliminar" color="danger">
                        <span 
                            className="text-lg text-danger cursor-pointer hover:text-red-400 transition active:scale-95" 
                            onClick={() => handleDelete(item.busId || item.id)}
                        >
                            <Trash2 size={18} />
                        </span>
                    </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* MODAL (Sirve para Crear y Editar) */}
      <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur" classNames={{ base: "bg-zinc-900 text-white border border-zinc-800" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{busToEdit ? "Editar Autobús" : "Registrar Autobús"}</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Input 
                    label="Placa" 
                    placeholder="Ej: BUS-2024" 
                    variant="bordered" 
                    value={plate} 
                    onValueChange={setPlate} 
                    classNames={{input:"text-white", inputWrapper: "border-zinc-700"}} 
                />
                <Input 
                    label="Capacidad" 
                    placeholder="Ej: 40" 
                    type="number" 
                    variant="bordered" 
                    value={capacity} 
                    onValueChange={setCapacity} 
                    classNames={{input:"text-white", inputWrapper: "border-zinc-700"}} 
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="danger" onPress={onClose}>Cancelar</Button>
                <Button color="primary" onPress={handleSave} isLoading={saving}>
                    {busToEdit ? "Actualizar" : "Guardar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}