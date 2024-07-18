import { TextInput, Select, FileInput, Button } from "flowbite-react";
import { useState } from "react";
import { IoMdPhotos } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postImagePreview, setPostImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

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
  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("postImage", postImage);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/post/write", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      navigateTo(`/post/${data.newPost.slug}`);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleCreatePost}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select onChange={(e) => setCategory(e.target.value)}>
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
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ align: [] }],
              [{ color: [] }, { background: [] }],
              ["link", "image", "video"],
              ["code-block"],
              ["clean"],
            ],
          }}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setContent(value);
          }}
          value={content}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          {loading ? "Publishing..." : "Publish"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
