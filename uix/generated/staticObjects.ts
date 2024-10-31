
// Start of File
import uixConfig from '../../uix.config'
import { NodeShape, NodeState, GraphDefinition, RelationshipState, RelationshipMerge } from '@thinairthings/uix'

export const uixGraph = new GraphDefinition(uixConfig.type, uixConfig.nodeDefinitionSet)
export const nodeDefinitionMap = uixGraph.nodeDefinitionMap
export type ConfiguredNodeDefinitionMap = typeof nodeDefinitionMap
export type NodeKey<T extends keyof ConfiguredNodeDefinitionMap> = {
    nodeType: T
    nodeId: string
}

export type UserNode = NodeShape<ConfiguredNodeDefinitionMap, 'User'> 

export type UserNodeState = NodeState<ConfiguredNodeDefinitionMap, 'User'>
