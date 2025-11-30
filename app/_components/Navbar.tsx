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
  import { BusFront } from "lucide-react";
  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";

export const AppNavbar = ()=>{
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

 
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
    router.refresh();
  };
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

            <NavbarContent justify="end">{
            user ? (
    <Dropdown placement="bottom-end" className="bg-zinc-900 border border-zinc-800 text-white">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="transition-transform"
          color="primary"
          name={user.fullName ? user.identityDocumentUrl : "U"}
          size="sm"
          src={user.identityDocumentUrl}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-semibold">Conectado como</p>
          <p className="font-semibold text-blue-400">{user.email}</p>
        </DropdownItem>
        <DropdownItem key="tickets" href="/tickets">Mis Boletos</DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          Cerrar Sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <>
      <NavbarItem className="hidden lg:flex">
        <Link href="/auth/login" className="text-gray-300 hover:text-white text-sm">
          Iniciar Sesión
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Button as={Link} color="primary" href="/auth/register" variant="flat" className="font-bold">
          Registrarse
        </Button>
      </NavbarItem>
    </>
  )}
</NavbarContent>
</Navbar>
);
};