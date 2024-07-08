import { useDispatch, useSelector } from "react-redux";
import { Button, Toast } from "flowbite-react";
import { useState } from "react";
``;
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../store/user/userSlice";
import { toast } from "react-toastify";

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(currentUser && currentUser.username);
  const [email, setEmail] = useState(currentUser && currentUser.email);
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    currentUser && currentUser.profilePicture && currentUser.profilePicture.url
  );
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    currentUser && currentUser.profilePicture && currentUser.profilePicture.url
  );

  // HANDLING PROFILE PICTURE
  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProfilePicturePreview(reader.result);
      setProfilePicture(file);
    };
  };

  // HANDLE PROFILE UPDATE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    // CREATE FORM DATA
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    // API CALL
    try {
      dispatch(updateStart());
      const res = await fetch(
        `http://localhost:8000/api/v1/user/update/${currentUser._id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );
      const data = await res.json();

      if (data.success === true) {
        toast.success(data.message);
        dispatch(updateSuccess(data.user));
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(updateFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdateProfile}>
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={profilePicturePreview && profilePicturePreview}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 dark:border-gray-100 border-gray-500"
          />
        </div>
        <input
          type="file"
          className="border-2 border-gray-700 rounded-md"
          onChange={handleProfilePicture}
        />
        <input
          className="h-10 w-full rounded-md bg-gray-100 px-3 py-2 text-sm focus:outline-none dark:bg-[#111827] dark:text-white"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          className="h-10 w-full rounded-md bg-gray-100 px-3 py-2 text-sm focus:outline-none dark:bg-[#111827] dark:text-white"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          className="h-10 w-full rounded-md bg-gray-100 px-3 py-2 text-sm focus:outline-none dark:bg-[#111827] dark:text-white"
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>

        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashboardProfile;
