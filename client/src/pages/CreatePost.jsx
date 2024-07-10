import { TextInput, Select, FileInput, Button } from "flowbite-react";
import { IoMdPhotos } from "react-icons/io";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <div className="flex items-center justify-center h-16 w-28 border-2 border-dotted border-teal-500 p-1">
            <IoMdPhotos size={30} />

            {/* <img
              src="https://i0.wp.com/www.projectsmind.com/wp-content/uploads/2021/05/What-is-project.png"
              alt=""
              className="object-cover h-full w-full"
            /> */}
          </div>

          <FileInput type="file" accept="image/*" />
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
