import { useSelector } from "react-redux";
import { TextInput, Button } from "flowbite-react";

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.profilePicture.url}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 dark:border-gray-100 border-gray-500"
          />
        </div>
        <input
          className="h-10 w-full rounded-md bg-gray-100 px-3 py-2 text-sm focus:outline-none dark:bg-[#111827] dark:text-white"
          type="text"
          placeholder="username"
          value={currentUser.username}
          id="username"
        ></input>
        <input
          className="h-10 w-full rounded-md bg-gray-100 px-3 py-2 text-sm focus:outline-none dark:bg-[#111827] dark:text-white"
          type="email"
          placeholder="email"
          value={currentUser.email}
          id="email"
        ></input>
        <input
          className="h-10 w-full rounded-md bg-gray-100 px-3 py-2 text-sm focus:outline-none dark:bg-[#111827] dark:text-white"
          type="password"
          placeholder="password"
          id="password"
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
