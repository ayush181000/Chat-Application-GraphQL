import { ApolloServer, gql } from 'apollo-server';
import crypto, { randomUUID } from 'crypto';

const users = [
  {
    id: 'asdaasd',
    firstName: 'mukesh',
    lastName: 'kumar',
    email: 'mukesh@mukeshkumar.com',
    password: '12345',
  },
  {
    id: 'vbnvbnvbn',
    firstName: 'suresh',
    lastName: 'sharma',
    email: 'suresh@sureshsharma.com',
    password: '123456',
  },
];

const Todos = [
  {
    title: 'buy book',
    by: 'asdaasd',
  },
  {
    title: 'Write code',
    by: 'asdaasd',
  },
  {
    title: 'record video',
    by: 'vbnvbnvbn',
  },
];

const typeDefs = gql`
  type Query {
    users: [User]
    user(id: ID!): User
  }

  input UserInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(userNew: UserInput): User
  }

  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    todos: [Todo]
  }

  type Todo {
    title: String!
    by: ID!
  }
`;

const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args, { userLoggedIn }) => {
      if (!userLoggedIn) throw new Error('you are not logged in');
      return users.find((item) => item.id == args.id);
    },
  },

  Mutation: {
    createUser: (_, { userNew }) => {
      const newUser = { id: crypto.randomUUID(), ...userNew };
      users.push(newUser);
      return newUser;
    },
  },

  User: {
    todos: (parent) => {
      console.log(parent);
      return Todos.filter((item) => item.by == parent.id);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    userLoggedIn: false,
  },
});

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`));
