"use client";
import Image from "next/image"
import { HStack, VStack } from "styled-system/jsx"
import Logo from "public/logos/pickpockt long.svg"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <VStack h='screen' w='screen' justify='space-between'>
      {/* Header/Nav */}
      <VStack>
        <Image src={Logo} alt='Pickpal' width={400} height={200} />
        <HStack w='full' justify='center'>
          <Button onClick={() => router.push('/auth/login')}>Login</Button>
          <Button variant='outline' onClick={() => router.push('/auth/signup')}>Sign up</Button>
        </HStack>
      </VStack>

      {/* Footer */}
      <HStack w='full' justify='center'>
        <Button variant='link' onClick={() => router.push('/privacy')}>Privacy Policy</Button>
        <Button variant='link' onClick={() => router.push('/tos')}>Terms of Service</Button>
      </HStack>
    </VStack>
  )
}