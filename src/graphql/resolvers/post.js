const {
  UserInputError,
  AuthenticationError,
  PubSub,
} = require("apollo-server");

const Post = require("../../models/Post");

const { commentInputValidator } = require("../../utils/validators");

const pubsub = new PubSub();

const POST_ADDED = "POST_ADDED";

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
      pubsub.publish(POST_ADDED, { postAdded: post });
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
    createComment: async (_, { postId, body }, { user }) => {
      const { valid, errors } = commentInputValidator({ body });
      if (!valid) {
        throw new UserInputError("Validation Error.", {
          errors,
        });
      }

      if (!user) {
        throw new AuthenticationError("Access denied.");
      }

      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found.");
      }

      post.comments.unshift({
        username: user.username,
        body,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      return post;
    },
    deleteComment: async (_, { postId, commentId }, { user }) => {
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found.");
      }

      const comment = post.comments.find((c) => c.id === commentId);
      if (!comment) {
        throw new UserInputError("Comment not found.");
      }

      if (!user || comment.username !== user.username) {
        throw new AuthenticationError("Access denied.");
      }

      post.comments = post.comments.filter((c) => c.id !== commentId);
      await post.save();
      return post;
    },
    likePost: async (_, { postId }, { user }) => {
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found.");
      }

      if (!user) {
        throw new AuthenticationError("Access denied.");
      }

      if (post.likes.find((l) => l.username === user.username)) {
        return post;
      }

      post.likes = post.likes.concat({
        username: user.username,
        createdAt: new Date().toISOString(),
      });
      await post.save();
      return post;
    },
    unlikePost: async (_, { postId }, { user }) => {
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post not found.");
      }

      if (!user) {
        throw new AuthenticationError("Access denied.");
      }

      post.likes = post.likes.filter((l) => l.username !== user.username);
      await post.save();
      return post;
    },
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
};
