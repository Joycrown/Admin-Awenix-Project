import { logo } from "../assets";
import { Link, useNavigate } from "react-router-dom";

import { RxAvatar } from "react-icons/rx";
import { useAuthContext } from "../utils/authContext";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import { MdClose, MdMenu } from "react-icons/md";

function Header() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <header className="sm:max-w-[1200px] w-[95%] py-4 mx-auto relative">
      <nav className="flex justify-between w-full items-center max-sm:flex-row-reverse">
        <div>
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer sm:hidden"
          >
            <MdMenu size="2rem" />
          </div>
          <Link className="relative z-10 max-sm:hidden" to="/account/home">
            <img src={logo} alt="Awenix logo" width={"20px"} height={"20px"} />
          </Link>
        </div>

        <div className="flex gap-3 items-center w-full max-w-80 sm:justify-end">
          <RxAvatar
            className="bg-default-500 text-default-800 rounded-full cursor-pointer"
            size="2.5rem"
          />
          <div className="flex flex-col capitalize">
            {user.id}
            <span className="text-xs">{user.userType}</span>
          </div>
        </div>

        {isOpen && (
          <div className="fixed bg-white z-50 w-full h-screen top-0 left-0 sm:hidden">
            <div className="relative z-50 flex justify-between items-center gap-4 px-4 mt-6">
              <Link className="relative z-10 block w-36" to="/account/home">
                <img src={logo} alt="Awenix logo" />
              </Link>

              <div onClick={() => setIsOpen(false)} className="cursor-pointer">
                <MdClose size="1.3rem" />
              </div>
            </div>
            <Sidebar mobile />
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
