import { logo } from "../assets";
import { Link } from "react-router-dom";

import { RxAvatar } from "react-icons/rx";
import { useAuthContext } from "../utils/authContext";

function Header() {
  const { user } = useAuthContext();

  return (
    <header className="max-w-[1200px] w-[95%] py-4 mx-auto relative">
      <nav className="flex justify-between max-container items-center">
        <Link className="relative z-10" to="/account/home">
          <img src={logo} alt="Awenix logo" width={"20px"} height={"20px"} />
        </Link>

        <div className="flex gap-3 items-center w-full max-w-80 justify-end">
          <RxAvatar
            className="bg-default-500 text-default-800 rounded-full cursor-pointer"
            size="2.5rem"
          />
          <div className="flex flex-col capitalize">
            {user.id}
            <span className="text-xs">{user.userType}</span>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
