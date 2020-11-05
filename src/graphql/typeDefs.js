const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }
  type Comment {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
  }
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    username: String!
    token: String!
    email: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]!
    getPost(postId: String!): Post!
  }
  type Mutation {
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    login(username: String!, password: String!): User!
    createPost(body: String!): Post!
    deletePost(postId: String!): String!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: String!): Post!
    likePost(postId: String!): Post!
    unlikePost(postId: String!): Post!
  }
`;
