import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CommentSection from "../components/CommentSection";
import { useSelector } from "react-redux";
import PostCard from "../components/PostCard";

const PostPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPost, setRecentPost] = useState([]);
  const [author, setAuthor] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/api/v1/post/getposts?slug=${slug}&userId=${currentUser._id}`
        );
        const data = await res.json();

        if (data.success !== true) {
          setError(true);
          setLoading(false);
          return;
        }

        if (data.success === true) {
          setPost(data.posts[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // FETCH RECENT POST
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/post/getposts?limit=${3}&userId=${
            currentUser._id
          }`
        );

        const data = await res.json();

        if (data.success === true) {
          setRecentPost(data.posts);
          setAuthor(data.user);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.postImage.url}
        alt={post && post.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>

      {/* Comment Section */}
      <CommentSection postId={post && post._id} />

      {/* Recent Post Section */}
      <div className="mx-auto max-w-7xl px-2">
        {/* posts */}
        <h1 className="text-xl mt-5 text-center font-semibold">Recent articles</h1>
        <div className="grid gap-6 gap-y-10 py-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPost.map((post) => (
            <PostCard post={post} author={author} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default PostPage;
