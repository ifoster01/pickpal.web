import { AnySubgraphDefinition, ExtractOutputTree, GenericNodeShape, GenericSubgraphDefinition, QueryError, removeRelationshipEntries, reverseRelationshipMapKey, SubgraphDefinition, SubgraphPathDefinition, subgraphRecursion } from "@thinairthings/uix";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfiguredNodeDefinitionMap, nodeDefinitionMap, NodeKey } from "~/uix/generated/staticObjects";
import { useQuery, skipToken, useQueryClient } from "@tanstack/react-query"
import { extractSubgraph } from "~/uix/generated/functionModule";
import _ from "lodash";
import { mergeSubgraphToGraphStore } from "./mergeSubgraphToGraphStore";
import { cycleSubgraphSubscriptions } from "./cycleSubgraphSubscriptionSet";
import { graphStore } from "./graphStore";
import { createSubgraphFromGraphStore } from "./createSubgraphFromGraphStore";





export const useGraph = <
    RootNodeType extends keyof ConfiguredNodeDefinitionMap,
    SubgraphDefinitionRef extends AnySubgraphDefinition,
    Data = ExtractOutputTree<ConfiguredNodeDefinitionMap, SubgraphDefinitionRef, RootNodeType>
>({
    rootNodeIndex,
    defineSubgraph,
    select,
    ...queryOptions
}: {
    rootNodeIndex: NodeKey<RootNodeType>
    defineSubgraph?: (subgraph: SubgraphDefinition<
        ConfiguredNodeDefinitionMap, 
        [SubgraphPathDefinition<
            ConfiguredNodeDefinitionMap,
            RootNodeType,
            []
        >]>
    ) => SubgraphDefinitionRef
    select?: (data: ExtractOutputTree<ConfiguredNodeDefinitionMap, SubgraphDefinitionRef, RootNodeType>) => Data
} & Omit<Parameters<typeof useQuery<
    ExtractOutputTree<ConfiguredNodeDefinitionMap, SubgraphDefinitionRef, RootNodeType>,
    QueryError<any>,
    Data,
    readonly [{
        readonly nodeType: RootNodeType;
        readonly nodeId: string;
    }, ...SubgraphDefinitionRef[]]
>>[0], 'queryKey' | 'queryFn' | 'select'>) => {
    const queryClient = useQueryClient()
    const selectCallback = useCallback(
        (data: ExtractOutputTree<ConfiguredNodeDefinitionMap, SubgraphDefinitionRef, RootNodeType>) => select!(data)
    , [select])
    const subgraphDefinition = defineSubgraph ? defineSubgraph(new SubgraphDefinition(nodeDefinitionMap, [new SubgraphPathDefinition(
        nodeDefinitionMap,
        rootNodeIndex.nodeType,
        []
    )])) : undefined
    const queryKey = useMemo(() => [{
        nodeType: rootNodeIndex.nodeType,
        nodeId: rootNodeIndex.nodeId
    }, ...!subgraphDefinition ? [] : [subgraphDefinition.serialize()]] as const, 
    [rootNodeIndex.nodeId, rootNodeIndex.nodeType, subgraphDefinition])
    // const subgraphRef = useRef<GenericNodeShape | undefined>(undefined)
    const queryOutput = useQuery({
        // The data structure being represented here is a map of subgraphs where the key is the serialized query input
        // The query input defines the subgraph
        queryKey: queryKey,
        queryFn: rootNodeIndex ? async ({queryKey: subgraphKey}) => {
            // Check for cache hit before making network request
            if (graphStore.getState().nodeMap.has(subgraphKey[0].nodeId)) {
                queryClient.setQueryData(subgraphKey, createSubgraphFromGraphStore({
                    pathSegment: subgraphKey[0].nodeType,
                    subgraphDefinition: subgraphKey[1] as GenericSubgraphDefinition,
                    treeNode: graphStore.getState().nodeMap.get(subgraphKey[0].nodeId) 
                        ? JSON.parse(JSON.stringify(graphStore.getState().nodeMap.get(subgraphKey[0].nodeId))) as GenericNodeShape
                        : undefined
                }))
            }
            // Get Subgraph
            const {data, error} = await extractSubgraph(...subgraphKey)
            if (error) throw new QueryError(error)
            mergeSubgraphToGraphStore({
                data: data as unknown as GenericNodeShape & {detach?: boolean, delete?: boolean},
            })
            return data
        } : skipToken,
        select: (subgraph) => {
            cycleSubgraphSubscriptions({
                queryClient,
                subgraphKey: queryKey,
                subgraph: subgraph as GenericNodeShape
            })
            return select ? selectCallback(subgraph) : subgraph as Data
        },
        ...queryOptions
    })
    return queryOutput
}