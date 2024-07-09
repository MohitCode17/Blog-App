import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Spinner } from "flowbite-react";
import { useState } from "react";
``;
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../store/user/userSlice";
import { toast } from "react-toastify";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashboardProfile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
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
  const [showModal, setShowModal] = useState(false);

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

  // HANDLE DELETE PROFILE
  const handleDeleteUser = async () => {
    setShowModal(false);

    try {
      dispatch(deleteUserStart());
      const res = await fetch(
        `http://localhost:8000/api/v1/user/delete/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success !== true) {
        dispatch(deleteUserFailure(data.message));
        toast.error(data.message);
        return;
      }

      dispatch(deleteUserSuccess(data.message));
      toast.success(data.message);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
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
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>

      {/* MODAL */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardProfile;
