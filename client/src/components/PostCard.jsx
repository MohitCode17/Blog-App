import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";

const PostCard = ({ post, author }) => {
  return (
    <div key={post?.title} className="border dark:border-gray-700">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post?.postImage?.url}
          className="aspect-video w-full rounded-md"
          alt="post-cover"
        />
      </Link>
      <div className="min-h-min p-3">
        <p className="mt-4 w-full text-xs font-semibold leading-tight text-gray-700 dark:text-gray-500">
          #{post.category}
        </p>
        <Link to={`/post/${post.slug}`}>
          <p className="mt-4 flex-1 text-base font-semibold text-gray-900 dark:text-gray-200 line-clamp-2">
            {post.title}
          </p>
        </Link>
        <div className="mt-4 flex space-x-3 ">
          <img
            className="h-full w-10 rounded-lg"
            src={author?.profilePicture?.url}
            alt={author?.username}
          />
          <div>
            <Link to={"/dashboard?tab=profile"}>
              <p className="text-sm font-semibold leading-tight text-gray-900 dark:text-gray-300">
                {author?.username}
              </p>
            </Link>
            <p className="text-sm leading-tight text-gray-600 dark:text-gray-500">
              {post && moment(post.createdAt).format("LL")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
