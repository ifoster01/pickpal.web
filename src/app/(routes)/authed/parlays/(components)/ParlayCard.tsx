import { Fragment, useState } from "react"
import { Parlay } from "../page"
import { HStack, VStack } from "@/styled-system/jsx"
import { Text } from "~/components/ui/text"
import { Input } from "~/components/ui/input"
import { convertToProbability } from "@/utils/functions"
import { ParlayLegCard } from "./ParlayLegCard"

export function ParlayCard({
    parlay,
    idx,
}: {
    parlay: Parlay,
    idx: number,
}) {
    const [betPool, setBetPool] = useState<number | null>(10)
    const payout = Math.round(parlay.payout)
    const payoutString = payout > 0 ? `+${payout}` : payout
    const payoutProbability = (convertToProbability(payout) * 100).toFixed(2)
    const probability = parlay.probability
    const probabilityString = probability > 0 ? `+${Math.round(probability)}` : Math.round(probability)
    const predictedProbability = (convertToProbability(probability) * 100).toFixed(2)

    return (
        <Fragment>
            {idx !== 0 && <VStack h='1px' w='full' bg='gray' />}
            <VStack mb={4} p={4} w='full'>
                <Text fontWeight={700}>Parlay {idx + 1}</Text>
                <VStack w='full'>
                    { parlay.fights.map((fight, j) => {
                        return (
                            <ParlayLegCard key={`${j}-${parlay.id}-${j * (new Date().getUTCMilliseconds())}`} fight={fight} idx={j} />
                        )
                    })}
                </VStack>
                <HStack justify='space-between' w='full'>
                    <Text>Book Payout:</Text>
                    <Text fontWeight={700}>{payoutString} ({payoutProbability}%)</Text>
                </HStack>
                <HStack justify='space-between' w='full'>
                    <Text>Predicted Probability:</Text>
                    <Text fontWeight={700}>{probabilityString} ({predictedProbability}%)</Text>
                </HStack>
                <HStack justify='space-between' w='full'>
                    <HStack gap={1}>
                        <Text>$</Text>
                        <Input
                            maxW={20}
                            w='fit-content'
                            type="number"
                            value={betPool ?? ''}
                            placeholder='Bet'
                            onChange={(e) => {
                                const text = e.target.value
                                if (isNaN(parseInt(text)) && text !== '' && text !== '+') return
                                if (isNaN(parseInt(text)) && text === '+') return setBetPool(null)
                                if (isNaN(parseInt(text))) return setBetPool(null)

                                setBetPool(parseInt(text))
                            }}
                        />
                        <Text>Bet Payout:</Text>
                    </HStack>
                    { betPool !== null ?
                    <Text fontWeight={700}>${((payout / 100) * betPool).toFixed(2)}</Text>
                    :
                    <Text fontWeight={700}>N/A</Text>
                    }
                </HStack>
            </VStack>
        </Fragment>
    )
}