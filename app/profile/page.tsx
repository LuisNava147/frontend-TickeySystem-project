'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Avatar, Divider, Spinner } from "@heroui/react";
import { Camera, Mail, ShieldAlert, Save } from "lucide-react";
import { useAuth } from "../admin/auth-context";
import { API_URL } from "@/constants";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, token, updateUser, isLoading } = useAuth(); // Acceso global
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch(`${API_URL}/users/upload/${user.userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      const updatedUserFromBackend = await res.json();

      updateUser(updatedUserFromBackend);
      
      setSelectedFile(null);
      setPreview(null);
      toast.success("¡Foto actualizada con éxito!", {
        description: "Tu nuevo avatar ya es visible en toda la aplicación."
      });

    } catch (error) {
      console.error(error);
      // 👇 3. ERROR ELEGANTE
      toast.error("Hubo un error al subir la imagen", {
        description: "Por favor intenta de nuevo más tarde."
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 flex justify-center items-start pt-20 min-h-screen">
      <Card className="w-full max-w-lg bg-surface border border-white/10 shadow-2xl">
        <CardHeader className="flex flex-col items-center pb-0 pt-10 relative">
          <div className="relative group">
            <Avatar 
              src={preview || user.indetifyDocumentUrl} 
              className="w-32 h-32 text-large border-4 border-primary/20"
              isBordered
              color="primary"
              name={user.userFullName ? user.userFullName.charAt(0).toUpperCase() : "U"}
            />
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-primary p-2.5 rounded-full shadow-lg hover:bg-primary/80 transition-transform active:scale-95 cursor-pointer z-10"
              title="Cambiar foto"
            >
              <Camera size={18} className="text-white" />
            </button>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" // Solo imágenes
            onChange={handleFileChange}
          />

          <h2 className="mt-4 text-2xl font-bold text-white">{user.userFullName}</h2>
          <div className="flex gap-2 mt-2">
            {user.roles?.map((role) => (
              <span key={role} className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 uppercase tracking-wider">
                {role}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardBody className="px-8 py-8 gap-6">
          

          {selectedFile && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <Button 
                color="primary" 
                variant="shadow" 
                className="w-full mb-2 font-bold text-md"
                isLoading={uploading}
                onPress={handleUpload}
                startContent={!uploading && <Save size={18} />}
              >
    
              </Button>
              <p className="text-center text-xs text-zinc-500">
                Se actualizará tu foto en toda la aplicación
              </p>
            </div>
          )}

          <Divider className="bg-white/10 my-2"/>
          <div className="space-y-4">
            <InfoRow 
              icon={<Mail size={20} className="text-primary" />} 
              label="Correo Electrónico" 
              value={user.userEmail} 
            />
            <InfoRow 
              icon={<ShieldAlert size={20} className="text-purple-400" />} 
              label="ID de Usuario" 
              value={user.userId} 
              isMono
            />
          </div>
        </CardBody>
      </Card>
    </main>
  );
}

function InfoRow({ icon, label, value, isMono = false }: { icon: React.ReactNode, label: string, value: string, isMono?: boolean }) {
  return (
    <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
      <div className="bg-zinc-800/50 p-2.5 rounded-lg">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-zinc-500 uppercase font-semibold mb-0.5">{label}</p>
        <p className={`text-sm text-zinc-200 truncate ${isMono ? 'font-mono tracking-tight text-xs' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}