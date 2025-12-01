'use client'

import { useEffect, useState, useCallback } from "react";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Input, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, 
  useDisclosure, Spinner, Select, SelectItem, Tooltip
} from "@heroui/react";
import { Waypoints, Plus, Trash2, ArrowRight, Pencil, RefreshCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/constants";

export default function AdminRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- MODAL CREAR/EDITAR ---
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [saving, setSaving] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<any>(null);

  // --- MODAL ELIMINAR (NUEVO) ---
  const { 
    isOpen: isDeleteOpen, 
    onOpen: onDeleteOpen, 
    onOpenChange: onDeleteChange,
    onClose: onDeleteClose 
  } = useDisclosure();
  const [deleting, setDeleting] = useState(false);
  const [routeIdToDelete, setRouteIdToDelete] = useState<string | null>(null);

  // Form Data
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeBasePrice, setPrice] = useState("");
  const [routeEstimateDuration, setDuration] = useState("");

  const fetchData = async () => {
    try {
      const [resRoutes, resLocations] = await Promise.all([
        fetch(`${API_URL}/routes`),
        fetch(`${API_URL}/locations`)
      ]);

      if (resRoutes.ok) setRoutes(await resRoutes.json());
      if (resLocations.ok) setLocations(await resLocations.json());
    } catch (e) { 
      toast.error("Error cargando datos");
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 1. ABRIR CREAR
  const openCreateModal = () => {
    setRouteToEdit(null);
    setOrigin(""); setDestination(""); setPrice(""); setDuration("");
    onOpen();
  };

  // 2. ABRIR EDITAR
  const handleEdit = (item: any) => {
    setRouteToEdit(item);
    setOrigin(item.origin?.locationId.toString() || item.origin?.id.toString());
    setDestination(item.destination?.locationId.toString() || item.destination?.id.toString());
    setPrice(item.routeBasePrice || item.basePrice);
    setDuration(item.routeEstimateDuration || item.estimatedDuration);
    onOpen();
  };

  // 3. GUARDAR
  const handleSave = async () => {
    if (!origin || !destination || !routeBasePrice || !routeEstimateDuration) {
      return toast.warning("Todos los campos son obligatorios");
    }
    if (origin === destination) return toast.error("Origen y destino iguales");

    setSaving(true);
    const token = localStorage.getItem('token');

    try {
      const url = routeToEdit 
        ? `${API_URL}/routes/${routeToEdit.routeId || routeToEdit.id}` 
        : `${API_URL}/routes`;
      
      const method = routeToEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
            origin: parseInt(origin),        
            destination: parseInt(destination), 
            routeBasePrice: parseFloat(routeBasePrice), 
            routeEstimateDuration: parseInt(routeEstimateDuration) 
        })
      });

      if (res.ok) {
        toast.success(routeToEdit ? "Ruta actualizada" : "Ruta creada");
        fetchData(); 
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Error al guardar");
      }
    } catch (error) { toast.error("Error de conexión"); } 
    finally { setSaving(false); }
  };

  // 4. ABRIR MODAL ELIMINAR (Reemplaza al confirm)
  const handleDeleteClick = (id: string) => {
    setRouteIdToDelete(id);
    onDeleteOpen();
  };

  // 5. CONFIRMAR ELIMINACIÓN
  const confirmDelete = async () => {
    if (!routeIdToDelete) return;
    setDeleting(true);
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`${API_URL}/routes/${routeIdToDelete}`, { 
            method: 'DELETE', 
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        
        if(res.ok) { 
            toast.success("Ruta eliminada"); 
            fetchData(); 
            onDeleteClose();
        } else { 
            toast.error("No se puede eliminar (Tiene viajes activos)"); 
        }
    } catch(e) { toast.error("Error de conexión"); }
    finally { setDeleting(false); }
  };

  const renderCell = useCallback((item: any, columnKey: React.Key) => {
    switch(columnKey) {
        case "origin": return <span className="font-bold text-white">{item.origin?.locationName || item.origin?.name}</span>;
        case "destination": 
            return (
                <div className="flex items-center gap-2 text-primary font-bold">
                    <ArrowRight size={16} /> 
                    {item.destination?.locationName || item.destination?.name}
                </div>
            );
        case "routeBasePrice": return <span className="text-green-400 font-mono">${item.routeBasePrice || item.basePrice}</span>;
        case "routeEstimateDuration": return <span className="bg-zinc-800 px-2 py-1 rounded text-xs text-zinc-300">{item.routeEstimateDuration || item.estimatedDuration} min</span>;
        case "actions": 
            return (
                <div className="flex justify-center items-center gap-3">
                    <Tooltip content="Editar">
                        <span className="text-lg text-blue-400 cursor-pointer" onClick={() => handleEdit(item)}><Pencil size={18} /></span>
                    </Tooltip>
                    <Tooltip content="Eliminar" color="danger">
                        {/* 👇 AHORA LLAMA AL NUEVO MÉTODO */}
                        <span className="text-lg text-danger cursor-pointer" onClick={() => handleDeleteClick(item.routeId || item.id)}><Trash2 size={18} /></span>
                    </Tooltip>
                </div>
            );
        default: return null;
    }
  }, []);

  return (
    <main className="container mx-auto p-6 min-h-screen pt-24">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2"><Waypoints className="text-primary" /> Rutas</h1>
            <p className="text-zinc-400 text-sm">Conecta tus destinos.</p>
        </div>
        <div className="flex gap-2">
            <Button isIconOnly variant="flat" onPress={() => fetchData()}><RefreshCcw size={18}/></Button>
            <Button color="primary" onPress={openCreateModal} startContent={<Plus />}>Nueva Ruta</Button>
        </div>
      </div>

      <Table aria-label="Routes Table" classNames={{ wrapper: "bg-zinc-900 border border-zinc-800 shadow-xl", th: "bg-zinc-950 text-zinc-400" }}>
        <TableHeader>
          <TableColumn key="origin">ORIGEN</TableColumn>
          <TableColumn key="destination">DESTINO</TableColumn>
          <TableColumn key="routeBasePrice">PRECIO BASE</TableColumn>
          <TableColumn key="routeEstimateDuration">DURACIÓN</TableColumn>
          <TableColumn key="actions" align="center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody items={routes} isLoading={loading} loadingContent={<Spinner />} emptyContent="Sin rutas definidas">
          {(item: any) => (
            <TableRow key={item.routeId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* MODAL CREAR/EDITAR */}
      <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="blur" classNames={{ base: "bg-zinc-900 text-white border border-zinc-800" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{routeToEdit ? "Editar Ruta" : "Crear Nueva Ruta"}</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <div className="flex gap-2">
                    <Select label="Origen" selectedKeys={origin ? [origin.toString()] : []} onChange={(e) => setOrigin(e.target.value)} classNames={{trigger:"bg-zinc-800 border-zinc-700", value:"text-white"}}>
                        {locations.map((loc: any) => <SelectItem key={loc.locationId || loc.id} textValue={loc.locationName || loc.name}>{loc.locationName || loc.name}</SelectItem>)}
                    </Select>
                    <Select label="Destino" selectedKeys={destination ? [destination.toString()] : []} onChange={(e) => setDestination(e.target.value)} classNames={{trigger:"bg-zinc-800 border-zinc-700", value:"text-white"}}>
                        {locations.map((loc: any) => <SelectItem key={loc.locationId || loc.id} textValue={loc.locationName || loc.name}>{loc.locationName || loc.name}</SelectItem>)}
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Input label="Precio ($)" type="number" value={routeBasePrice} onValueChange={setPrice} classNames={{input:"text-white", inputWrapper: "border-zinc-700"}} />
                    <Input label="Duración (hrs)" type="number" value={routeEstimateDuration} onValueChange={setDuration} classNames={{input:"text-white", inputWrapper: "border-zinc-700"}} />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose} className="text-zinc-300">Cancelar</Button>
                <Button color="primary" onPress={handleSave} isLoading={saving}>
                    {routeToEdit ? "Actualizar" : "Guardar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL ELIMINAR (NUEVO) */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteChange} backdrop="blur" classNames={{ base: "bg-zinc-900 text-white border border-zinc-800" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                <div className="p-3 rounded-full bg-red-500/20 text-red-500 mb-2">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold">¿Eliminar Ruta?</h3>
              </ModalHeader>
              <ModalBody className="text-center pb-6">
                <p className="text-zinc-400">Esta acción es irreversible.</p>
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