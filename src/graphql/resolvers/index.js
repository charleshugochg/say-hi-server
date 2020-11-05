const postResolver = require("./post");
const userResolver = require("./user");

module.exports = {
  Post: {
    likeCount: async ({ likes }) => likes.length,
    commentCount: async ({ comments }) => comments.length,
  },
  Query: {
    ...postResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...postResolver.Mutation,
  },
  Subscription: {
    ...postResolver.Subscription,
  },
};
