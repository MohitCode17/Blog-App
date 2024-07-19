import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { pathname } = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // GET SEARCH TERM FROM URL LOGIC
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // HANDLE SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    navigateTo(`/search?${searchQuery}`);
  };

  return (
    <Navbar className="border-b dark:bg-[#111827]">
      <Link to={"/"} className="items-center gap-1">
        <img src="./logo.svg" alt="logo" className="flex sm:hidden" />
        <span className="hidden sm:flex font-bold text-xl text-[#312ecb]">
          Fin<span className="text-[#007aff]">Tech</span>
        </span>
      </Link>

      <form onSubmit={handleSubmit}>
        <div className="flex grow justify-end">
          <input
            className="h-10 w-[150px] sm:w-[250px] rounded-md bg-gray-100 px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none dark:bg-[#111827] dark:text-white"
            type="text"
            placeholder="Serach"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></input>
        </div>
      </form>

      <div className="flex gap-2 md:order-2">
        {currentUser ? (
          <Dropdown
            className="dark:bg-[#1d273b]"
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser.profilePicture.url} rounded />
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
