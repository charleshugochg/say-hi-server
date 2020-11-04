const { UserInputError, AuthenticationError } = require("apollo-server");

const Post = require("../../models/Post");

module.exports = {
  Query: {
    getPosts: async () => {
      const posts = await Post.find({});
      return posts;
    },
    getPost: async (_, { postId }) => {
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found.");
      }
      return post;
    },
  },
  Mutation: {
    createPost: async (_, { body }, { user }) => {
      if (!user) {
        throw new AuthenticationError("Access denied.");
      }

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date().toISOString(),
        user: user.id,
      });
      const post = await newPost.save();
      return post;
    },
    deletePost: async (_, { postId }, { user }) => {
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found.");
      }
      if (!user || !post.user.equals(user.id)) {
        throw new AuthenticationError("Access denied.");
      }
      await post.delete();
      return "Post deleted successfully.";
    },
  },
};
