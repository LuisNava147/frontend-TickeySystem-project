'use client'
import { useState } from 'react';
import NextLink from 'next/link'; 
import { Input, Button, Card, CardHeader, CardBody, Link } from "@heroui/react";
import { useAuth } from '@/app/context/auth-context';
import { Mail, Lock, BusFront } from 'lucide-react';
import { API_URL } from '@/constants';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userEmail: email, 
            userPassword: password 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Credenciales incorrectas');
      }

      const data = await res.json();
      
      login(data.access_token, data.user);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
<Card className="w-full max-w-[400px] bg-zinc-900/90 border border-white/10 shadow-2xl backdrop-blur-md">
      <CardHeader className="flex flex-col gap-2 text-center pt-8 pb-4">
        <div className="mx-auto bg-primary/20 p-3 rounded-full text-primary mb-2">
          <BusFront size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Bienvenido a Bordo</h1>
        <p className="text-sm text-zinc-400">Accede al sistema de Chihuahueños</p>
      </CardHeader>
      
      <CardBody className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Input 
            label="Correo Electrónico" 
            placeholder="ejemplo@correo.com" 
            type="email" 
            variant="bordered"
            classNames={{
              inputWrapper: "bg-black/50 border-zinc-700 hover:border-primary/50 focus-within:!border-primary",
              label: "text-zinc-400",
              input: "text-white"
            }}
            startContent={<Mail className="text-zinc-500" size={18} />}
            value={email}
            onValueChange={setEmail}
            isRequired
          />
          
          <Input 
            label="Contraseña" 
            placeholder="••••••••" 
            type="password" 
            variant="bordered"
            classNames={{
              inputWrapper: "bg-black/50 border-zinc-700 hover:border-primary/50 focus-within:!border-primary",
              label: "text-zinc-400",
              input: "text-white"
            }}
            startContent={<Lock className="text-zinc-500" size={18} />}
            value={password}
            onValueChange={setPassword}
            isRequired
          />
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <Button 
            color="primary" 
            type="submit" 
            isLoading={loading} 
            className="font-bold text-md shadow-lg shadow-primary/25 w-full mt-2"
            size="lg"
          >
            Ingresar
          </Button>
          <div className="text-center text-sm text-zinc-500 mt-2">
            ¿Aún no tienes cuenta?{' '}
            <Link as={NextLink} href="/signup" className="text-primary hover:text-primary/80 transition-colors font-semibold cursor-pointer">
              Crear cuenta
            </Link>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}