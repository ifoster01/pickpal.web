"use client";
import Image from "next/image"
import { HStack, VStack } from "styled-system/jsx"
import Logo from "public/logos/pickpockt long.svg"
import { Button } from "~/components/ui/button"
import { useRouter } from "next/navigation";
import { Text } from "~/components/ui/text";

export default function Home() {
  const router = useRouter();
  return (
    <VStack h='screen' w='screen' justify='space-between'>
      {/* Header/Nav */}
      <VStack pt={6} px={4}>
        <Image src={Logo} alt='Pickpal' width={300} height={150} />
        <Text mt={10} textAlign={'center'} fontSize={'4xl'}>
          We&apos;ve made sports betting easy for you.
        </Text>
        <Text textAlign={'center'} mt={10}>
          To get access to picks from our advanced machine learning models, log in or sign up below.
        </Text>
        <Button mt={10} w='full' onClick={() => router.push('/auth/login')}>Login</Button>
        <Button w='full' variant='outline' onClick={() => router.push('/auth/signup')}>Sign up</Button>
      </VStack>

      {/* Footer */}
      <HStack w='full' justify='center'>
        <Button variant='link' onClick={() => router.push('/privacy')}>Privacy Policy</Button>
        <Button variant='link' onClick={() => router.push('/tos')}>Terms of Service</Button>
      </HStack>
    </VStack>
  )
}