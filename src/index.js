const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const { MONGODB_URL } = require("./config");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("MongoDB connected.");
    return server.listen();
  })
  .then((res) => {
    console.log(`Server is listening at ${res.url}`);
  });
