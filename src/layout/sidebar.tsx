import { BsCashCoin } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { useAuthContext } from "../utils/authContext";
import { NavLink, useNavigate } from "react-router-dom";
import { PiSquareHalf, PiListDashesThin } from "react-icons/pi";
import { IoSpeedometerOutline, IoSettingsOutline } from "react-icons/io5";

function Sidebar() {
  const navLinks = [
    {
      name: "Dashboard",
      route: "/admin/dashboard",
      icon: <IoSpeedometerOutline size="1rem" />,
    },
    {
      name: "Products",
      route: "/admin/products",
      icon: <PiSquareHalf size="1rem" />,
    },
    {
      name: "Shipping",
      route: "/admin/pending",
      icon: <BsCashCoin size="1rem" />,
    },
    {
      name: "Order Lists",
      route: "/admin/orders",
      icon: <PiListDashesThin size="1rem" />,
    },
  ];

  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const logOut = () => {
    setUser({ accessToken: "", refreshToken: "", name: "", isLogged: false });
    navigate("/");
  };

  return (
    <nav className="max-sm:hidden min-w-[200px] min-h-[86.5vh]">
      <nav className="fixed min-w-[200px] h-full p-4 text-sm top-0">
        <nav className="flex flex-col gap-2 h-full pt-[77px] pb-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.route}
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 flex gap-2 items-center bg-default-500 rounded relative text-white before:w-4 before:h-full before:absolute before:-left-7 before:bg-default-500 before:top-0 before:rounded capitalize"
                  : "px-3 py-2 flex gap-2 items-center capitalize"
              }
            >
              {link.icon} <span>{link.name}</span>
            </NavLink>
          ))}

          <div className="mt-auto space-y-2">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                isActive
                  ? "px-3 py-2 flex gap-2 items-center bg-default-500 rounded relative text-white before:w-4 before:h-full before:absolute before:-left-7 before:bg-default-500 before:top-0 before:rounded capitalize"
                  : "px-3 py-2 flex gap-2 items-center capitalize"
              }
            >
              <IoSettingsOutline size="1rem" />
              <span>Settings</span>
            </NavLink>

            <div
              onClick={logOut}
              className="px-3 py-2 flex gap-2 items-center capitalize cursor-pointer"
            >
              <RiShutDownLine size="1rem" />
              <span>Logout</span>
            </div>
          </div>
        </nav>
      </nav>
    </nav>
  );
}

export default Sidebar;
