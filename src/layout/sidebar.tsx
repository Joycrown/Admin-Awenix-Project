import { BsCashCoin } from "react-icons/bs";
import { RiShutDownLine } from "react-icons/ri";
import { useAuthContext } from "../utils/authContext";
import { NavLink, useNavigate } from "react-router-dom";
import { PiSquareHalf, PiListDashesThin } from "react-icons/pi";
import { IoSpeedometerOutline, IoSettingsOutline } from "react-icons/io5";
import { MdWorkspacesFilled } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";

function Sidebar({ mobile }: { mobile: boolean }) {
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
      name: "Services",
      route: "/admin/services",
      icon: <MdWorkspacesFilled size="1rem" />,
     
    },
    {
      name: "Order Lists",
      route: "/admin/orders",
      icon: <PiListDashesThin size="1rem" />,
    },
    {
      name: "Pending Lists",
      route: "/admin/pending",
      icon: <BsCashCoin size="1rem" />,
    },
    {
      name: "Customers",
      route: "/admin/customers",
      icon: <FaUsers size="1rem" />,
    },
  ];

  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [orderCount, setOrderCount] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);


  // const endpoint = import.meta.env.VITE_AWENIX_BACKEND_URL;


  const markNotificationsAsRead = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "mark_as_read"
      }));
      setOrderCount(0); // Clear the notification count immediately
    }
  };

  useEffect(() => {
    // Correct WebSocket URL format
    const wsUrl = import.meta.env.VITE_AWENIX_PROD_ENV === 'true'
  ? `${import.meta.env.VITE_AWENIX_BACKEND_URL.replace(/^http/, 'ws')}/ws/admin`
  : 'ws://127.0.0.1:8000/ws/admin';

    // For production, you might want to use:
    // const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/admin`;
    
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log('Connected to WebSocket');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === 'orders_count') {
            setOrderCount(data.count);
          }
        };

        ws.onclose = () => {
          console.log('Disconnected from WebSocket');
          setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };
      } catch (error) {
        console.error('WebSocket connection error:', error);
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const logOut = () => {
    setUser({
      accessToken: "",
      refreshToken: "",
      name: "",
      isLogged: false,
      userType: "",
      id: "",
    });
    navigate("/account/login");
  };

  return (
    <nav
      className={`${
        mobile ? "w-full" : "max-sm:hidden"
      } min-w-[200px] min-h-[86.5vh]`}
    >
      <nav
        className={`${
          mobile ? "w-full" : ""
        } fixed min-w-[200px] h-full p-4 text-sm top-0`}
      >
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

          <button 
            onClick={markNotificationsAsRead}
            className="flex items-center space-x-2 p-3 rounded-lg bg-gray-200 w-full hover:bg-gray-600 transition-colors"
          >
            <FaBell className="h-5 w-5" />
            <div className="flex items-center justify-between w-full">
              <span>New Orders</span>
              {orderCount > 0 && (
                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                  {orderCount}
                </span>
              )}
            </div>
          </button>

          <div className="mt-auto space-y-2">
            {user.userType !== "staff" && (
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  isActive
                    ? "px-3 py-2 flex gap-2 items-center bg-default-500 rounded relative text-white before:w-4 before:h-full before:absolute before:-left-7 before:bg-default-500 before:top-0 before:rounded capitalize"
                    : "px-3 py-2 flex gap-2 items-center capitalize"
                }
              >
                <IoSettingsOutline size="1rem" />
                <span>Manage Admin</span>
              </NavLink>
            )}

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
