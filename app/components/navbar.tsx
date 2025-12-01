'use client'

import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link, 
  Button, 
  Avatar, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  DropdownSection
} from "@heroui/react";
import { useAuth } from "../admin/auth-context";
import NextLink from "next/link";
import { BusFront } from "lucide-react"; // Opcional si tienes el icono

export const AppNavbar = () => {
  const { user, logout } = useAuth();

  // 👇 LÓGICA INTELIGENTE: 
  // Definimos a dónde lleva el botón dependiendo del rol
  const isUserAdmin = user?.roles?.includes('Admin');
  const ticketsLink = isUserAdmin ? "/admin/tickets" : "/tickets";
  const ticketsLabel = isUserAdmin ? "Panel de Tickets" : "Mis Boletos";

  return (
    <Navbar shouldHideOnScroll className="bg-black/80 text-white backdrop-blur-md border-b border-white/5">
      <NavbarBrand>
        <Link as={NextLink} href="/" color="foreground" className="flex items-center gap-2">
          {/* Si no tienes lucide-react instalado, borra la línea de BusFront */}
          <BusFront className="text-primary" /> 
          <p className="font-bold text-inherit tracking-wider text-xl">CHIHUAHUEÑOS</p>
        </Link>
      </NavbarBrand>
      
      {/* MENÚ CENTRAL (Escritorio) */}
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link as={NextLink} color="foreground" href="/" className="text-zinc-300 hover:text-white transition font-medium">
            Viajes
          </Link>
        </NavbarItem>
        
        {/* Solo mostramos este link si el usuario ha iniciado sesión */}
        {user && (
          <NavbarItem>
            <Link as={NextLink} color="foreground" href={ticketsLink} className="text-zinc-300 hover:text-white transition font-medium">
              {ticketsLabel}
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      
      {/* MENÚ DERECHO (Usuario / Login) */}
      <NavbarContent justify="end">
        {user ? (
          // --- VISTA USUARIO LOGUEADO ---
          <Dropdown placement="bottom-end" className="bg-zinc-900 border border-zinc-800 text-white">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                // Usamos tus nombres personalizados: userFullName
                name={user.userFullName ? user.userFullName.charAt(0).toUpperCase() : "U"}
                size="sm"
                // Usamos tus nombres personalizados: indetifyDocumentUrl
                src={user.indetifyDocumentUrl} 
              />
            </DropdownTrigger>
            
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              {/* SECCIÓN 1: ADMINISTRACIÓN (Solo visible si es Admin) */}
              {/* Nota: Usamos un ternario para renderizar la sección completa o null */}
              {isUserAdmin ? (
                <DropdownSection title="Administración" showDivider>
                  <DropdownItem 
                    key="admin-dashboard" 
                    href="/admin/tickets" 
                    className="text-warning font-semibold"
                    
                  >
                    Panel de Tickets
                  </DropdownItem>
                  <DropdownItem key="admin-locations" href="/admin/locations" >
                    Gestionar Ubicaciones
                  </DropdownItem>
                  <DropdownItem key="admin-buses" href="/admin/buses" >
                    Gestionar Autobuses
                  </DropdownItem>
                  <DropdownItem key="admin-routes" href="/admin/routes" >
                    Gestionar Rutas
                  </DropdownItem>
                </DropdownSection>
              ) : (
                // Elemento vacío requerido por TypeScript en algunos casos estrictos, 
                // pero HeroUI suele aceptar null. Si da error, usa <DropdownItem className="hidden"/>
                <DropdownSection className="hidden">
                   <DropdownItem key="hidden" className="hidden" />
                </DropdownSection>
              )}

              {/* SECCIÓN 2: GENERAL (Visible para todos) */}
              <DropdownSection title="Usuario">
                <DropdownItem key="info" className="h-14 gap-2 opacity-100" textValue="Info">
                  <p className="font-semibold">Conectado como</p>
                  <p className="font-semibold text-primary">{user.userEmail}</p>
                </DropdownItem>
                
                <DropdownItem key="profile" href="/profile">Mi Perfil</DropdownItem>
                
                {/* Enlace dinámico (Mis Boletos o Panel) */}
                <DropdownItem 
                    key="my-tickets-admin" 
                    href="/tickets" 
                  >
                    Mis Boletos Personales
                  </DropdownItem>
                
                <DropdownItem key="logout" color="danger" onPress={logout}>
                  Cerrar Sesión
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        ) : (
          // --- VISTA INVITADO ---
          <>
            <NavbarItem className="hidden lg:flex">
              <Link as={NextLink} href="/login" className="text-zinc-400 hover:text-white text-sm">
                Iniciar Sesión
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={NextLink} href="/signup" color="primary" variant="shadow" className="font-bold">
                Registrarse
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};