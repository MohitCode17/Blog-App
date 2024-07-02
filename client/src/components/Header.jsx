import { Button, Navbar, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();

  return (
    <Navbar className="border-b">
      <Link to={"/"} className="flex items-center gap-1">
        <img src="./logo.svg" alt="logo" />
        <span className="sm:flex hidden font-bold text-xl text-[#312ecb]">
          Fin<span className="text-[#007aff]">Tech</span>
        </span>
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        ></TextInput>

        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch size={18} />
        </Button>
      </form>

      <div className="flex gap-2 md:order-2">
        <Link to={"/login"}>
          <Button gradientDuoTone={"purpleToBlue"}>Login</Button>
        </Link>
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
