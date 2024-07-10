import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    postImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
        required: true,
        default:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL9LumFKQsPeVZVDrY-B3JOK_WBzoo4YWFvQ&s",
      },
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
