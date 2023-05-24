/* eslint-disable */
import { createServer } from 'http'
import { gateway } from './gateway.js'
import { IntrospectAndCompose } from "@apollo/gateway";

async function main() {
    const yoga = await gateway({
        supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
                { name: 'messages', url: 'http://localhost:4001/graphql' },
                // ...additional subgraphs...
            ],
        }),
    })

    // Start the server and explore http://localhost:4000/graphql
    const server = createServer(yoga)
    server.listen(4000, () => {
        console.info(
            `Server is running on http://localhost:4000${yoga.graphqlEndpoint}`,
        )
    })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})