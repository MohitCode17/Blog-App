import { IoSunny, IoMoon } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/theme/themeSlice";

const ToggleThemeButton = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="bg-gray-300 text-gray-500 w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950 dark:text-white"
    >
      {theme === "light" ? <IoMoon size={22} /> : <IoSunny size={22} />}
    </button>
  );
};

export default ToggleThemeButton;
