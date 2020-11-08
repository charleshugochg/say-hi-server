const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const authorizer = require("./graphql/authorizer");

const { MONGODB_URL } = require("../config") || process.env;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authorizer,
});

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected.");
    return server.listen({ port: process.env.PORT || 4000 });
  })
  .then((res) => {
    console.log(`Server is listening at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
