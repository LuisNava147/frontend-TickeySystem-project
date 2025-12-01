'use client'

import { useEffect, useState } from "react";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Spinner, Tooltip 
} from "@heroui/react";
import { MapPin, Plus, Trash2, AlertTriangle, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/constants";

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal Crear
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  
  // Modal Eliminar (NUEVO)
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onOpenChange: onDeleteChange,
    onClose: onDeleteClose 
  } = useDisclosure();

  const [newLocationName, setNewLocationName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [locationIdToDelete, setLocationIdToDelete] = useState<number | null>(null);

  // 1. Cargar Ubicaciones
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/locations`);
      if (res.ok) setLocations(await res.json());
    } catch (e) { 
        toast.error("Error cargando datos");
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  // 2. Crear Ubicación
  const handleCreate = async () => {
    if (!newLocationName.trim()) return toast.warning("Escribe un nombre");
    
    setSaving(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
            locationName: newLocationName 
        })
      });

      if (res.ok) {
        toast.success("Ubicación agregada");
        fetchLocations();
        onClose();
        setNewLocationName("");
      } else {
        toast.error("Error al crear (¿Ya existe?)");
      }
    } catch (error) { toast.error("Error de conexión"); }
    finally { setSaving(false); }
  };

  // 3. Preparar Eliminación
  const handleDeleteClick = (id: number) => {
    setLocationIdToDelete(id);
    onDeleteOpen();
  };

  // 4. Confirmar Eliminación
  const confirmDelete = async () => {
    if (!locationIdToDelete) return;
    setDeleting(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/locations/${locationIdToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Ubicación eliminada");
        fetchLocations();
        onDeleteClose();
      } else {
        // Aquí capturamos el error si la ubicación está en uso por una ruta
        const err = await res.json();
        toast.error("No se puede eliminar", {
            description: "Esta ubicación está siendo usada en una Ruta."
        });
      }
    } catch (e) { toast.error("Error de conexión"); }
    finally { setDeleting(false); }
  };

  return (
    <main className="container mx-auto p-6 min-h-screen pt-24">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-primary" /> Ubicaciones
            </h1>
            <p className="text-zinc-400 text-sm">Catálogo de destinos disponibles.</p>
        </div>
        <div className="flex gap-2">
            <Button isIconOnly variant="flat" onPress={() => fetchLocations()}><RefreshCcw size={18}/></Button>
            <Button color="primary" onPress={onOpen} startContent={<Plus />}>
            Nueva Ciudad
            </Button>
        </div>
      </div>

      <Table aria-label="Locations Table" classNames={{ wrapper: "bg-zinc-900 border border-zinc-800 shadow-xl", th: "bg-zinc-950 text-zinc-400" }}>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>NOMBRE</TableColumn>
          <TableColumn align="center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody items={locations} isLoading={loading} loadingContent={<Spinner />} emptyContent="Sin ubicaciones">
          {(item: any) => (
            <TableRow key={item.locationId || item.id}>
              <TableCell className="text-zinc-500 font-mono">{item.locationId || item.id}</TableCell>
              <TableCell className="font-bold text-white text-lg">{item.locationName || item.name}</TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <Tooltip content="Eliminar" color="danger">
                    <span 
                        className="text-danger cursor-pointer hover:text-red-400 transition active:scale-95" 
                        onClick={() => handleDeleteClick(item.locationId || item.id)}
                    >
                        <Trash2 size={20} />
                    </span>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal de Creación */}
      <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur" classNames={{ base: "bg-zinc-900 text-white border border-zinc-800" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Agregar Nueva Ciudad</ModalHeader>
              <ModalBody>
                <Input 
                  autoFocus
                  label="Nombre" 
                  placeholder="Ej: Guadalajara" 
                  variant="bordered" 
                  value={newLocationName}
                  onValueChange={setNewLocationName}
                  classNames={{ input: "text-white", label: "text-zinc-400"}}
                />
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} className="text-zinc-300">Cancelar</Button>
                <Button color="primary" onPress={handleCreate} isLoading={saving}>Guardar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal de Eliminación (NUEVO) */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteChange} backdrop="blur" classNames={{ base: "bg-zinc-900 text-white border border-zinc-800" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                <div className="p-3 rounded-full bg-red-500/20 text-red-500 mb-2">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold">¿Eliminar Ubicación?</h3>
              </ModalHeader>
              <ModalBody className="text-center pb-6">
                <p className="text-zinc-400">Si borras esta ciudad, podrías afectar a las Rutas que la usan como Origen o Destino.</p>
              </ModalBody>
              <ModalFooter className="justify-center gap-4 pb-6">
                <Button variant="flat" onPress={onClose}>Cancelar</Button>
                <Button color="danger" onPress={confirmDelete} isLoading={deleting} className="font-bold shadow-lg shadow-red-500/20">
                  Sí, Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}