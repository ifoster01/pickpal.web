import {  DerivedDraftInputTree, DraftErrorTree, GenericMergeOutputTree, GenericNodeShape, getRelationshipEntries, MergeInputTree, nextNodeTypeFromRelationshipKey, NodeState, RecursiveExactType, RelationshipTypeUnion, RelationshipUnion, subgraphRecursion } from "@thinairthings/uix";
import { ConfiguredNodeDefinitionMap, nodeDefinitionMap, NodeKey } from "~/uix/generated/staticObjects";
import {useImmer} from '@thinairthings/use-immer'
import { useCallback, useEffect, useRef } from "react";
import _ from "lodash";
import { AnyZodObject, z, ZodIssue } from "zod";


export const useGraphDraft = <
    NodeType extends keyof ConfiguredNodeDefinitionMap,
    DefaultDraftData extends Omit<MergeInputTree<ConfiguredNodeDefinitionMap, NodeType, NodeId>, 'nodeType' | 'nodeId'>,
    NodeId extends string | undefined = undefined,
    // DefaultDraftData extends MergeInputTree<ConfiguredNodeDefinitionMap, NodeType, NodeId> = MergeInputTree<ConfiguredNodeDefinitionMap, NodeType, NodeId>,
    IncomingGraphData extends NodeKey<NodeType> | {nodeType: NodeType} = {nodeType: NodeType},
>({
    basedOn,
    createDraft,
}: {
    basedOn?: {nodeType: NodeType, nodeId?: NodeId} & IncomingGraphData,
    createDraft: (basedOn?: IncomingGraphData) => (
        RecursiveExactType<
            DefaultDraftData, 
            MergeInputTree<ConfiguredNodeDefinitionMap, NodeType, NodeId>
        >
    )
}) => {
    const createDraftCallback = useCallback(() => ({
        ...basedOn ? {
            nodeType: basedOn.nodeType,
            nodeId: basedOn.nodeId
        } : {},
        ...createDraft(basedOn as IncomingGraphData)
    }), [basedOn])
    const initialDraftRef = useRef(createDraftCallback())
    const [draft, updateDraft] = useImmer(initialDraftRef.current)
    const [draftErrors, setDraftErrors] = useImmer({} as DraftErrorTree<DefaultDraftData>)

    // Update the draft when the node loads
    useEffect(() => {
        updateDraft(createDraftCallback())
    }, [basedOn?.nodeId, basedOn?.nodeType])

    const isDraftValid = useCallback((draft: DefaultDraftData & {nodeType?:NodeType, nodeId?: string}): draft is IncomingGraphData extends NodeKey<NodeType> 
        ? DefaultDraftData & {
            nodeType: NodeType
            nodeId: string
        } : DefaultDraftData & {
            nodeType: NodeType
        }=> {
        if( !basedOn) return false
        const createNestedZodSchema = (node: GenericMergeOutputTree, acc: AnyZodObject=z.object({})) => {
            const nextSchema = nodeDefinitionMap[node.nodeType as keyof typeof nodeDefinitionMap]!.stateSchema as AnyZodObject
            acc = acc.merge(
                nextSchema.pick(Object.fromEntries(Object.keys(node).map(key => [key, true])))
            )
            getRelationshipEntries(node).forEach(([relationshipKey, nextNodeMap]) => {
                acc = acc.extend({
                    [relationshipKey]: z.object(Object.fromEntries(Object.entries(nextNodeMap).map(([nodeId, node]) => {
                        return [nodeId, createNestedZodSchema({
                            nodeType: nextNodeTypeFromRelationshipKey(relationshipKey),
                            ...node as any
                        }, z.object({}))]
                    })))
                })
            })
            return acc
        }
        const draftSchema = createNestedZodSchema(draft as GenericMergeOutputTree)
        const result = draftSchema.safeParse(draft)
        if (result.error){
            const createErrorTree = (issue: ZodIssue, path: any[], acc: Record<string, any>={}) => {
                if (path.length === 1) {
                    acc[path[0]] = issue.message
                    return acc
                }
                acc[path[0]] = acc[path[0]]??{}
                createErrorTree(issue, path.slice(1), acc[path[0]])
                return acc
            }
            const errorSet = result.error.issues.reduce((acc, issue) => {
                acc = createErrorTree(issue, issue.path, acc)
                return acc
            }, {} as any)
            setDraftErrors(errorSet)
            return false
        }
        setDraftErrors({})
        return true
    }, [basedOn])
    return {
        draft,
        draftErrors,
        updateDraft,
        setDraftErrors,
        isDraftValid
    } as const
}