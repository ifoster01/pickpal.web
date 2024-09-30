import Image from "next/image"
import { VStack } from "styled-system/jsx"
import Logo from "public/pickpal outline.svg"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/auth/login')
  }

  return (
    <VStack h='screen' w='screen'>
      <Image src={Logo} alt='Pickpal' width={200} height={200} />
    </VStack>
  )
}