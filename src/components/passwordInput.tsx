import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function PasswordInput({
  value,
  setValue,
  id,
  placeholder,
}: {
  value: string;
  setValue: (value: string) => void;
  id: string;
  placeholder: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex gap-3 items-center relative">
      {/* Password */}
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        placeholder={placeholder}
        className="border-b px-2 py-3 outline-none w-full"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <div
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2 cursor-pointer"
      >
        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </div>
    </div>
  );
}

export default PasswordInput;
