import { useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import Logo from "@/assets/images/Logo.png";
import { setSelectedService } from "@/features/information/infoSlice";
import { AppDispatch } from "@/store/store";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();

  const menuItems = [
    { name: "Top Up", path: "/topup" },
    { name: "Transaction", path: "/transaction" },
    { name: "Akun", path: "/profile" },
  ];

  return (
    <header className=" border-b bg-white border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="w-full px-[10vw] flex justify-between items-center py-3">
        <Link
          to="/"
          className="flex items-center space-x-2"
          onClick={() => dispatch(setSelectedService(null))}
        >
          <img src={Logo} alt="Logo" className="w-8 h-8" />
          <span className="text-lg font-semibold text-black">SIMS PPOB</span>
        </Link>

        <nav className="flex space-x-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `text-sm font-medium ${
                  isActive ? "text-red-500" : "text-black hover:text-red-400"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
