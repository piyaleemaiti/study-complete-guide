const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    status: String!
    post: [Post!]!
  }
  input userInputData {
    email: String!
    name: String!
    password: String!
  }
  type AuthData {
    token: String!
    userId: String!
  }
  type RootQuery {
    login(email: String!, password: String!): AuthData!
  }
  type RootMutation {
    createUser(userInput: userInputData): User!
    createPost: String!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
