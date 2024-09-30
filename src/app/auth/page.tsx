import { VStack } from "@/styled-system/jsx";
import Image from "next/image";
import Logo from "public/pickpal long.svg";     

export default function () {
    return (
        <VStack h='screen' w='screen'>
            <Image src={Logo} alt='Pickpal' width={200} height={200} />
        </VStack>
    )
}