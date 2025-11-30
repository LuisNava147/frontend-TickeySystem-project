'use client'
import {
    Navbar, 
    NavbarBrand, 
    NavbarContent, 
    NavbarItem, 
    Link, 
    Button 
  } from "@heroui/react";
  import { BusFront } from "lucide-react";

export const AppNavbar = ()=>{
    return(
        <Navbar shouldHideOnScroll className="bg-black/80 text-white backdrop-blur-md">
            <NavbarBrand>
                <BusFront className="mr-2 text-blue-500" />
                <p className="font-bold text-inherit tracking-wider">CHIHUAHUEÑOS</p>
            </NavbarBrand>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive>
                    <Link color="foreground" href="/" aria-current="page" 
                    className="text-blue-400 font-semibold">
                        Viajes
                    </Link>
                </NavbarItem>
                <NavbarItem>
                     <Link color="foreground" href="/tickets"  
                    className="text-gray-300 hover:text-white transition">
                        Mis boletos
                     </Link>   
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link  href="/auth/login" className="text-gray-300 hover:text-white-sm">
                        Iniciar Sesión
                    </Link>    
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="/auth/register"
                    variant="flat" className="font-bold">
                        Registrarse
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}