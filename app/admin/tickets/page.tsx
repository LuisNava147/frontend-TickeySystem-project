'use client'

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, 
  Input, Button, Chip, Tooltip, User, Spinner,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@heroui/react";
import { Search, Trash2, Ban, RefreshCcw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/constants";

const columns = [
  {name: "USUARIO", uid: "user"},
  {name: "RUTA", uid: "route"},
  {name: "FECHA", uid: "date"},
  {name: "ASIENTO", uid: "seat"},
  {name: "ESTATUS", uid: "status"},
  {name: "ACCIONES", uid: "actions"},
];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'CANCEL' | 'DELETE' | null>(null);

  const fetchTickets = useCallback(async (term = "") => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');

    try {
      setLoading(true);
      const url = term ? `${API_URL}/tickets?term=${term}` : `${API_URL}/tickets`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      } else {
        if(res.status === 403) {
            toast.error("Acceso Denegado: Área restringida a Admins");
            router.push('/');
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.roles?.includes('Admin')) {
        router.push('/tickets'); // Si no es admin, lo mandamos a su vista personal
        return;
    }
    fetchTickets();
  }, [fetchTickets, router]);

  const handleSearch = () => fetchTickets(searchTerm);

  const confirmAction = (id: string, type: 'CANCEL' | 'DELETE') => {
    setSelectedId(id);
    setActionType(type);
    onOpen();
  };

  const executeAction = async () => {
    if (!selectedId || !actionType) return;
    setActionLoading(true);
    const token = localStorage.getItem('token');

    try {
      let res;
      if (actionType === 'CANCEL') {
        res = await fetch(`${API_URL}/tickets/${selectedId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ ticketStatus: 'CANCELLED' })
        });
      } else {
        res = await fetch(`${API_URL}/tickets/${selectedId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      if (res.ok) {
        toast.success(actionType === 'CANCEL' ? "Boleto Cancelado" : "Boleto Eliminado");
        onClose();
        fetchTickets(searchTerm);
      } else {
        toast.error("Error al procesar la acción");
      }
    } catch (e) {
      toast.error("Error de conexión");
    } finally {
      setActionLoading(false);
    }
  };

  const renderCell = useCallback((ticket: any, columnKey: React.Key) => {
    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{radius: "lg", src: ticket.user?.indetifyDocumentUrl}}
            description={ticket.user?.userEmail}
            name={ticket.user?.userFullName}
          >
            {ticket.user?.userEmail}
          </User>
        );
      case "route":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize text-white">{ticket.trip?.route?.origin?.locationName} ➝ {ticket.trip?.route?.destination?.locationName}</p>
            <p className="text-bold text-xs capitalize text-zinc-500">Bus: {ticket.trip?.bus?.busPlateNumber}</p>
          </div>
        );
      case "date":
        return (
          <div className="flex flex-col">
            <span className="text-bold text-sm text-zinc-300">{new Date(ticket.trip?.tripDepartureDate).toLocaleDateString()}</span>
            <span className="text-tiny text-zinc-500">{new Date(ticket.trip?.tripDepartureDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
          </div>
        );
      case "seat":
        return <p className="text-xl font-bold text-center text-primary">{ticket.ticketSeatNumber}</p>;
      case "status":
        return (
          <Chip className="capitalize border-none gap-1 text-default-600" color={ticket.ticketStatus === 'RESERVED' ? "success" : "danger"} size="sm" variant="dot">
            {ticket.ticketStatus}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-4 justify-center">
            <Tooltip content="Cancelar" color="warning">
              <span className="text-lg text-yellow-500 cursor-pointer active:opacity-50" onClick={() => confirmAction(ticket.ticketId, 'CANCEL')}>
                <Ban size={20} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => confirmAction(ticket.ticketId, 'DELETE')}>
                <Trash2 size={20} />
              </span>
            </Tooltip>
          </div>
        );
      default: return ticket[columnKey as keyof typeof ticket];
    }
  }, []);

  return (
    <main className="container mx-auto p-6 min-h-screen pt-24 pb-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
        <p className="text-zinc-400">Gestión global de reservas y pasajeros.</p>
      </div>
      
      <div className="flex gap-4 mb-6">
        <Input
          isClearable
          classNames={{ base: "w-full sm:max-w-[400px]", inputWrapper: "bg-zinc-900 border-zinc-800" }}
          placeholder="Buscar por Nombre..."
          startContent={<Search className="text-zinc-500" size={18} />}
          value={searchTerm}
          onValueChange={setSearchTerm}
          onClear={() => { setSearchTerm(""); fetchTickets(""); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button color="primary" onPress={handleSearch}>Buscar</Button>
        <Button isIconOnly variant="flat" onPress={() => fetchTickets(searchTerm)}><RefreshCcw size={18}/></Button>
      </div>

      <Table aria-label="Tabla Admin" classNames={{ wrapper: "bg-zinc-900 border border-zinc-800", th: "bg-zinc-950 text-zinc-400" }}>
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={tickets} isLoading={loading} loadingContent={<Spinner label="Cargando..." />} emptyContent="Sin resultados">
          {(item: any) => (
            <TableRow key={item.ticketId}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" classNames={{ base: "bg-zinc-900 border border-zinc-800 text-white" }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 items-center pt-8">
                <div className={`p-3 rounded-full ${actionType === 'DELETE' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'} mb-2`}>
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold">{actionType === 'DELETE' ? '¿Eliminar?' : '¿Cancelar?'}</h3>
              </ModalHeader>
              <ModalBody className="text-center pb-6">
                <p className="text-zinc-400">Esta acción afectará el estado del boleto en la base de datos.</p>
              </ModalBody>
              <ModalFooter className="justify-center gap-4 pb-6">
                <Button variant="flat" onPress={onClose}>Volver</Button>
                <Button color={actionType === 'DELETE' ? "danger" : "warning"} onPress={executeAction} isLoading={actionLoading}>
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}