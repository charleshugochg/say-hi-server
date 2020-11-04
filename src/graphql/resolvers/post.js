const Post = require("../../models/Post");

module.exports = {
  Query: {
    posts: async () => {
      const posts = await Post.find({});
      return posts;
    },
  },
};
