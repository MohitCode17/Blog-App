import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(
        `http://localhost:8000/api/v1/post/getposts?userId=${currentUser._id}`
      );

      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
        setUser(data.user);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-2">
        <div className="flex flex-col space-y-8 pb-10 pt-12 md:pt-24">
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-200 md:text-5xl md:leading-10">
            Explore Technology and Finance
          </p>
          <p className="max-w-4xl text-base text-gray-600 dark:text-gray-500 md:text-xl">
            Welcome to FinTech! Explore the intersection of technology and
            finance with in-depth programming tutorials, industry trends, and
            financial insights. Join me, Mohit Gupta, to learn and stay ahead in
            this dynamic landscape. Let's innovate, invest, and inspire
            together.
          </p>
          <div className="mt-6 flex w-full items-center space-x-2 md:w-1/3">
            <input
              className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:placeholder:text-gray-500"
              type="text"
              placeholder="Search Topics"
            ></input>
            <Button type="button" gradientDuoTone={"purpleToBlue"}>
              Search
            </Button>
          </div>
        </div>
        {/* posts */}
        <div>
          <h1 className="mt-6 text-3xl">Recent Posts</h1>
        </div>
        <div className="grid gap-6 gap-y-10 py-6 md:grid-cols-2 lg:grid-cols-3">
          {posts &&
            posts.length > 0 &&
            posts.map((post) => (
              <PostCard key={post._id} post={post} author={user} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
