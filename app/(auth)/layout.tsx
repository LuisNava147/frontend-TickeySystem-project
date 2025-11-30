export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      // min-h-screen: Ocupa toda la altura
      // flex items-center justify-center: Centra el contenido perfectamente
      // p-4: Un poco de margen en móviles para que no toque los bordes
      <div className="flex min-h-screen items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center">
        
        {/* Capa oscura para leer mejor */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        
        {/* Contenedor del formulario (z-10 para estar encima del fondo) */}
        <div className="relative z-10 w-full flex justify-center">
          {children}
        </div>
      </div>
    );
  }