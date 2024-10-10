import { Box, HStack, VStack } from "@/styled-system/jsx";

export function Scale({
    value,
}:{
    value: number;
}) {
    const interpolate = (start: number, end: number) => {
        let k = (Math.abs(value) - 0) / 0.5; // 0 =>min  && 10 => MAX
        return Math.ceil((1 - k) * start + k * end) % 256;
    };

    const color = () => {
        let r = interpolate(255, 0);
        let g = interpolate(0, 255);
        let b = interpolate(0, 0);
        return `rgb(${r},${g},${b})`;
    };

    console.log(-1 * value * 100 * 1.75)

    return (
        <HStack w='full' gap={0}>
            <VStack
                w='full'
                position='relative'
                height={2}
                bg='#cccccc'
                borderTopLeftRadius={4}
                borderBottomLeftRadius={4}
            >
                { value < 0 &&
                    <VStack
                        position='absolute'
                        right={0}
                        height={2}
                        borderTopLeftRadius={4}
                        borderBottomLeftRadius={4}
                        style={{
                            width: `${-1 * value * 100 * 1.75}%`,
                            backgroundColor: color(),
                        }}
                    />
                }
            </VStack>
            <VStack
                w='4px'
                position='relative'
                height={2}
                bg='black'
            />
            <VStack
                w='full'
                position='relative'
                height={2}
                bg='#cccccc'
                borderTopRightRadius={4}
                borderBottomRightRadius={4}
            >
                { value > 0 &&
                    <VStack
                        position='absolute'
                        left={0}
                        bg='red'
                        height={2}
                        borderTopRightRadius={4}
                        borderBottomRightRadius={4}
                        style={{
                            width: `${value * 100 * 1.75}%`,
                            backgroundColor: color(),
                        }}
                    />
                }
            </VStack>
      </HStack>
    )
}