import { maskError, createYoga, createPubSub } from 'graphql-yoga'
import { createServer } from 'http'
import { typeDefs, resolvers } from './schema.js'
import { buildSubgraphSchema } from '@apollo/subgraph'


function main() {
    const schema = buildSubgraphSchema([{ typeDefs, resolvers }])
    const pubsub = createPubSub();
    const yoga = createYoga({
        schema, 
        context: { pubsub },
        maskedErrors: {
            maskError(error, message, isDev) {
                if (error?.extensions?.code === 'DOWNSTREAM_SERVICE_ERROR') {
                    return error
                }

                return maskError(error, message, isDev)
            }
        }
    })
    const server = createServer(yoga)
    server.listen(4001, () => {
        console.info('Server is running on http://localhost:4001/graphql')
    })
}

main()