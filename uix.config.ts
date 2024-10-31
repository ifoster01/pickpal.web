import { defineConfig } from "@thinairthings/uix";
import { UserNodeDefinition } from "./uix/NodeDefinitions/UserNodeDefinition";



export default defineConfig({
    type: 'Base',
    nodeDefinitionSet: [
        UserNodeDefinition
    ] as const,
    envPath: ".env.local",
    outdir: "uix/generated"
})