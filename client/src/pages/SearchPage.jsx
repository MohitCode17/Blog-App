import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useSelector } from "react-redux";

const SearchPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [user, setUser] = useState([]);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigateTo = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(
        `http://localhost:8000/api/v1/post/getposts?userId=${currentUser._id}&${searchQuery}`
      );
      const data = await res.json();
      if (data.success === true) {
        setPosts(data.posts);
        setUser(data.user);
        setLoading(false);

        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigateTo(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500 md:w-[500px]">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Post
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Sort By</label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Select Category</label>
            <Select
              id="category"
              value={sidebarData.category}
              onChange={handleChange}
            >
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="programming">Programming</option>
              <option value="web development">Web Development</option>
              <option value="stock market">Stock Market</option>
              <option value="finance">Finance</option>
              <option value="cybersecurity">Cybersecurity</option>
              <option value="maching leaning">Maching Learning</option>
              <option value="data science">Data Science</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="grid gap-4 gap-y-6 py-6 px-4 md:grid-cols-2 lg:grid-cols-3">
        {posts &&
          posts.length > 0 &&
          posts.map((post) => (
            <PostCard key={post._id} post={post} author={user} />
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
