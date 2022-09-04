import { gql } from 'apollo-server';

const typeDefs = gql`
  # query
  type Query {
    users: [User]
    messagesByUser(receiverId: Int!): [Message]
  }

  # input
  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input UserSigninInput {
    email: String!
    password: String!
  }

  # mutations
  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createMessage(receiverId: Int!, text: String!): Message
  }

  # subscriptions
  type Subscription {
    messageAdded: Message
  }

  # data types
  scalar Date

  type Message {
    id: ID!
    text: String!
    receiverId: ID!
    senderId: ID!
    createdAt: Date!
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
  }

  type Token {
    token: String!
  }
`;

export default typeDefs;
