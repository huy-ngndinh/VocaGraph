import { useNavigate } from "react-router-dom";
import { CookieSetOptions } from "universal-cookie";

interface Props {
  email: string,
  removeCookie: (name: string, options?: CookieSetOptions) => void;
}

export default function Account({ email, removeCookie }: Props)  {

  const navigate = useNavigate();

  const onClick = () => {
    removeCookie("token");
    navigate("/");
  }

  return (
    <div className="relative size-full flex flex-col items-center gap-2.5">
      <div className="mt-10">Welcome back, {email}</div>
      <button onClick={onClick} className="absolute bottom-0 mb-10 h-2/25 w-1/6 bg-transparent hover:bg-red-600 border-2 border-red-600 rounded-md text-xl text-red-700 hover:text-black font-semibold tracking-wide transition-all">
        Logout
      </button>
    </div>
  );
}

