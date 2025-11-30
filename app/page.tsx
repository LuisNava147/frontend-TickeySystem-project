import Image from 'next/image'
import { Button } from "@heroui/react";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 bg-red-950 text-white'>
      <h1 className='text-4xl font-bold'>Chihuahuenos S. A. de C. V.</h1>
      <p>Prueba de herouUI</p>
      <Button color='primary' size='lg'variant='shadow'>
        Hola mundo!
      </Button>
    </main>
  )
}
