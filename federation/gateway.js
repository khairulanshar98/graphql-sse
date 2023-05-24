import { createYoga, maskError } from 'graphql-yoga'
import { ApolloGateway } from '@apollo/gateway'
import { useApolloFederation } from '@envelop/apollo-federation'

export async function gateway(config) {
    const gateway = new ApolloGateway(config)
    await gateway.load()
    const yoga = createYoga({
        plugins: [
            useApolloFederation({
                gateway,
            }),
        ],
        maskedErrors: {
            maskError(error, message, isDev) {
              // Note: it seems like the "useApolloFederation" plugin should do this by default?
              if (error?.extensions?.code === 'DOWNSTREAM_SERVICE_ERROR') {
                return error
              }
              return maskError(error, message, isDev)
            },
          },
    })

    return yoga
}