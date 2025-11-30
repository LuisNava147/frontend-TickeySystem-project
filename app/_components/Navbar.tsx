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
  DropdownItem
} from "@heroui/react";
import { useAuth } from "../context/auth-context";
import NextLink from "next/link"; 

export const AppNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar shouldHideOnScroll className="bg-black/80 text-white backdrop-blur-md border-b border-white/5">
      <NavbarBrand>
        <Link as={NextLink} href="/" color="foreground">
          <p className="font-bold text-inherit tracking-wider text-xl">CHIHUAHUEÑOS</p>
        </Link>
      </NavbarBrand>
      
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link as={NextLink} color="foreground" href="/" className="text-zinc-300 hover:text-white transition font-medium">
            Viajes
          </Link>
        </NavbarItem>
        {user && (
          <NavbarItem>
            <Link as={NextLink} color="foreground" href="/tickets" className="text-zinc-300 hover:text-white transition font-medium">
              Mis Boletos
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>
      
      <NavbarContent justify="end">
        {user ? (
          <Dropdown placement="bottom-end" className="bg-zinc-900 border border-zinc-800 text-white">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.userFullName ? user.userFullName.charAt(0).toUpperCase() : "U"}
                size="sm"
                src={user.indetifyDocumentUrl} 
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="info" className="h-14 gap-2" textValue="Info">
                <p className="font-semibold">Conectado como</p>
                <p className="font-semibold text-primary">{user.userEmail}</p>
              </DropdownItem>
              <DropdownItem key="profile" href="/profile">Mi Perfil</DropdownItem>
              <DropdownItem key="tickets" href="/tickets">Mis Boletos</DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={logout}>
                Cerrar Sesión
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          
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