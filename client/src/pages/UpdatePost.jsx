import { TextInput, Select, FileInput, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postImagePreview, setPostImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const { postId } = useParams();

  // FETCH POST BY ID
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/post/getposts?postId=${postId}`
        );
        const data = await res.json();

        if (data.success === true) {
          const postData = data.posts[0];
          setTitle(postData.title);
          setContent(postData.content);
          setCategory(postData.category);
          setPostImagePreview(postData.postImage.url);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPosts();
  }, [postId]);

  // HANDLING PROFILE PICTURE
  const handlePostImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPostImagePreview(reader.result);
      setPostImage(file);
    };
  };

  // HANDLE CREATE POST
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (postImage) {
      formData.append("postImage", postImage);
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/post/update/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();

      setLoading(false);
      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      navigateTo(`/post/${data.post.slug}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdatePost}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            className="flex-1"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <FileInput type="file" accept="image/*" onChange={handlePostImage} />
        {postImagePreview && (
          <div className="w-full h-[350px]">
            <img
              src={postImagePreview && postImagePreview}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setContent(value);
          }}
          value={content}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          {loading ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePost;
