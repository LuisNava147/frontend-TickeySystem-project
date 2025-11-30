'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, Button, Avatar, Input, Divider } from "@heroui/react";
import { Camera, User, Mail, ShieldAlert } from "lucide-react";
import { API_URL } from "@/constants";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    setUser(JSON.parse(userStr));
  }, [router]);

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
    setLoading(true);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', selectedFile); 

    try {
      const res = await fetch(`${API_URL}/users/upload/${user.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Error al subir imagen");

      const updatedUser = await res.json();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserState = {
        ...currentUser,
        indetifyDocumentUrl: updatedUser.indetifyDocumentUrl 
      };
   
      localStorage.setItem('user', JSON.stringify(newUserState));
      setUser(newUserState);
      setSelectedFile(null);
      setPreview(null);
      
      alert("¡Foto actualizada con éxito!")
      window.dispatchEvent(new Event('userUpdated'));


    } catch (error) {
      console.error(error);
      alert("Hubo un error al subir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <main className="container mx-auto p-4 md:p-10 min-h-screen flex justify-center items-start pt-20">
      <Card className="w-full max-w-lg bg-zinc-900 border border-zinc-800 text-white shadow-2xl">
        <CardHeader className="flex flex-col items-center pb-0 pt-10">
          <div className="relative group">
            <Avatar 
              src={user.identityDocumentUrl} 
              className="w-32 h-32 text-large border-4 border-blue-500/30"
              isBordered
              color="primary"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-500 transition cursor-pointer"
            >
              <Camera size={20} className="text-white" />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
          />

          <h2 className="mt-4 text-2xl font-bold">{user.fullName}</h2>
          <p className="text-gray-400 text-sm">{user.roles?.join(" | ")}</p>
        </CardHeader>

        <CardBody className="px-8 py-8 gap-6">
          {selectedFile && (
            <Button 
              color="primary" 
              variant="shadow" 
              className="w-full mb-4 font-bold"
              isLoading={loading}
              onPress={handleUpload}
            >
              Guardar Nueva Foto 
            </Button>
          )}

          <Divider className="bg-zinc-700"/>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-zinc-800/50 p-3 rounded-lg">
              <div className="bg-blue-500/20 p-2 rounded-full">
                <Mail size={20} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Correo Electrónico</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-zinc-800/50 p-3 rounded-lg">
              <div className="bg-purple-500/20 p-2 rounded-full">
                <ShieldAlert size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">ID de Usuario</p>
                <p className="text-xs font-mono text-gray-300 truncate w-60">{user.id}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}