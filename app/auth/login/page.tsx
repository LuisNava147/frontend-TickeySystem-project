'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'; 
import { Input, Button, Card, CardHeader, CardBody, Link } from "@heroui/react";
import { API_URL } from '@/constants';

export default function LoginPage() {
  const router = useRouter();
  
  const [userEmail, setEmail] = useState('');
  const [userPassword, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userEmail, 
            userPassword 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const data = await res.json();
      
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log("Login exitoso:", data);

      router.push('/');
      router.refresh(); 

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Card className="w-full max-w-md p-6 shadow-xl bg-zinc-900 border border-zinc-800">
        <CardHeader className="flex flex-col gap-1 text-center pb-6">
          <h1 className="text-2xl font-bold text-blue-500">Bienvenido de nuevo</h1>
          <p className="text-sm text-gray-400">Ingresa a tu cuenta para viajar</p>
        </CardHeader>
        
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input 
              label="Correo Electrónico" 
              placeholder="tu@email.com" 
              type="email" 
              variant="bordered"
              color="primary"
              value={userEmail}
              onValueChange={setEmail}
              isRequired
              classNames={{
                inputWrapper: "bg-zinc-800 border-zinc-700 hover:border-zinc-500",
                label: "text-zinc-400",
                input: "text-white"
              }}
            />
            <Input 
              label="Contraseña" 
              placeholder="********" 
              type="password" 
              variant="bordered"
              color="primary"
              value={userPassword}
              onValueChange={setPassword}
              isRequired
              classNames={{
                inputWrapper: "bg-zinc-800 border-zinc-700 hover:border-zinc-500",
                label: "text-zinc-400",
                input: "text-white"
              }}
            />
            
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <Button 
              color="primary" 
              type="submit" 
              isLoading={loading} 
              className="font-bold text-lg shadow-lg shadow-blue-500/20"
              size="lg"
            >
              Iniciar Sesión
            </Button>

            <div className="text-center text-sm text-gray-500 mt-2">
              ¿No tienes cuenta?{' '}
              <Link as={NextLink} href="/auth/register" className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                Regístrate aquí
              </Link>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}