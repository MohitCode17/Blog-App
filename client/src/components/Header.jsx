import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Navbar className="border-b dark:bg-[#191919]">
      <Link to={"/"} className="flex items-center gap-1">
        <img src="./logo.svg" alt="logo" />
        <span className="sm:flex hidden font-bold text-xl text-[#312ecb]">
          Fin<span className="text-[#007aff]">Tech</span>
        </span>
      </Link>

      <form>
        <div className="flex grow justify-end">
          <input
            className="hidden lg:flex h-10 w-[250px] rounded-md bg-gray-100 px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none dark:bg-[#292929] dark:text-white"
            type="text"
            placeholder="Serach"
          ></input>
        </div>

        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch size={18} />
        </Button>
      </form>

      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            className="dark:bg-[#292929]"
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/login"}>
            <Button gradientDuoTone={"purpleToBlue"}>Login</Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>

      <Navbar.Collapse>
        <Navbar.Link active={pathname === "/"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={pathname === "/about"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={pathname === "/projects"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
