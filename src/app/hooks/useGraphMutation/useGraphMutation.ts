import {useMutation} from "@tanstack/react-query"
import { GenericNodeShape, MergeInputTree, QueryError, removeRelationshipEntries, subgraphRecursion } from "@thinairthings/uix"
import { extractSubgraph, mergeSubgraph } from "~/uix/generated/functionModule"
import { graphStore } from "../useGraph/graphStore"
import { mergeSubgraphToGraphStore } from "../useGraph/mergeSubgraphToGraphStore"
import { useMemo, useState, useTransition } from "react"
import { ConfiguredNodeDefinitionMap, nodeDefinitionMap } from "~/uix/generated/staticObjects"
import _ from "lodash"
import {v4 as uuid} from "uuid"
export const useGraphMutation = () => {
    const mutation = useMutation({
        mutationFn: async (incomingSubgraph: GenericNodeShape) => {
            // Update Graph
            const {data, error} = await mergeSubgraph(incomingSubgraph as any)
            if (error) throw new QueryError(error)
            return data
        },
        onMutate: (incomingSubgraph) => {
            // Get the previous state of the graphStore
            const previousGraphStore = structuredClone(graphStore.getState())
            const subgraphKeySetToInvalidate = new Set<string>()
            // Update the graphStore
            mergeSubgraphToGraphStore({
                data: incomingSubgraph,
                replace: false
            })
            return {previousData: previousGraphStore, subgraphKeySetToInvalidate}
        },
        onError: (error, variables, context) => {
            console.log("Error", error)
            // Rollback on Error
            if (context?.previousData) {
                graphStore.setState(context.previousData)
            }
        }
    })
    const [isCheckingIndex, setIsCheckingIndex] = useState(false)
    return useMemo(() => ({
        ...mutation,
        isPending: mutation.isPending || isCheckingIndex,
        mutate: async <
            NodeType extends keyof ConfiguredNodeDefinitionMap,
            NodeId extends string | undefined = undefined
        >(
            incomingSubgraph: {nodeType: NodeType, nodeId?: NodeId}&MergeInputTree<ConfiguredNodeDefinitionMap, NodeType, NodeId>, 
            options?: Parameters<typeof mutation['mutate']>[1]
        ) => {
            // Check case where rootNode is an indexed node like email
            if (!incomingSubgraph.nodeId && _.intersection(
                Object.keys(incomingSubgraph), 
                nodeDefinitionMap[incomingSubgraph.nodeType as keyof typeof nodeDefinitionMap]['uniqueIndexes']).filter(indexKey => indexKey !== 'nodeId').length
            ) {
                const indexEntry = Object.entries(removeRelationshipEntries(incomingSubgraph))
                    .find(([key, value]) => value && nodeDefinitionMap[incomingSubgraph.nodeType as keyof typeof nodeDefinitionMap]['uniqueIndexes'].includes(key as any))
                setIsCheckingIndex(true)
                const lookupResult = await extractSubgraph({
                    nodeType: incomingSubgraph.nodeType,
                    [indexEntry![0]]: incomingSubgraph[indexEntry![0] as keyof typeof incomingSubgraph] as any
                } as any)
                setIsCheckingIndex(false)
                if (lookupResult.data) {
                    incomingSubgraph = {
                        ...incomingSubgraph,
                        ['nodeId']: lookupResult.data.nodeId,
                    }
                }  // Node doesn't exist in db, create it like normal
            }
            // Prep the incoming subgraph
            incomingSubgraph = subgraphRecursion({
                nextNode: structuredClone(incomingSubgraph) as unknown as GenericNodeShape,
                operation: ({nextNode, relationshipKey, nodeId, previousNodeMap, previousNode}) => {
                    const nodeType = relationshipKey?.split('-')[2]!.replace('>', '')
                    if (nodeType) {nextNode['nodeType'] = nodeType}
                    if (!nextNode['createdAt']) {nextNode['createdAt'] = Date.now()}
                    nextNode['updatedAt'] = Date.now()
                    switch(true){
                        case (!nextNode['nodeId'] && !previousNode): {
                            nextNode['nodeId'] = uuid(); 
                            break
                        }
                        case (!nextNode['nodeId'] && !!previousNode): nextNode['nodeId'] = nodeId!; break
                    }
                    if (!previousNodeMap) return 'continue'
                    previousNodeMap[nextNode['nodeId']] = nextNode
                    return 'continue'
                }
            }) as any
            mutation.mutate(incomingSubgraph as any, options)
        },
    }) as const, [mutation])
}