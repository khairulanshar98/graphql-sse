import { parse, GraphQLError } from 'graphql'
const messages = [];
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);

export const typeDefs = parse(/* GraphQL */ `
  type Message {
    id: ID!
    topic: String!
    user: String!
    content: String!
  }
  type Query {
    messages: [Message!]
    message(id: ID!): [Message!]
  }
  type Mutation {
    postMessage(user: String!, content: String!, topic: String!): Message!
  }
  type Subscription {
    newMessage(topic: String!): Message!
    countdown(from: Int!): Int!
  }
`);

export const resolvers = {
    Query: {
        messages: () => messages,
        message: (_, { id }) => messages.filter(r => r.id.toString() === id.toString()),
    },
    Mutation: {
        postMessage: (_, { user, content, topic }, { pubsub }) => {
            const id = messages.length;
            const message = {
                id,
                user,
                content,
                topic,
            }
            messages.push(message);
            pubsub.publish("message", topic, message)
            return { id, user, content, topic };
        },
    },
    Subscription: {
        newMessage: {
            subscribe: function (_, { topic }, { pubsub }) {
                return pubsub.subscribe("message", topic)
            },
            resolve: (p) => p
        },
        countdown: {
            subscribe: async function* (_, { from }) {
                for (let i = from; i >= 0; i--) {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    yield { countdown: i }
                }
            }
        }
    },
};
