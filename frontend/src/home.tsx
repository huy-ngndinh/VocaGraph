import TitleSvg from "./assets/title.svg";
import { useNavigate } from "react-router-dom";
import Background from "./background";

export default function Home() {

  const navigate = useNavigate();

  return (
    <div className="fixed h-screen w-screen bg-blue-50 flex items-center justify-center">
      <Background />
      <div className="absolute size-full z-10 flex flex-col justify-center items-center gap-6">
        <div className="h-1/4 w-1/2">
          <img src={TitleSvg} alt="Title" className="size-full"/>
        </div>
        <button className="relative size-auto group hover:scale-110 transition-all duration-300" onClick={() => navigate("/main")}>
          <div className="absolute h-full w-0 group-hover:w-full transition-all duration-300 left-0 bg-blue-300 opacity-70"/>
          <span className="text-3xl font-semibold tracking-wide underline underline-offset-2 decoration-4 decoration-blue-300">
            Homepage
          </span>
        </button>
        <button className="relative size-auto group hover:scale-110 transition-all duration-300" onClick={() => navigate("/login")}>
          <div className="absolute h-full w-0 group-hover:w-full transition-all duration-300 left-0 bg-blue-300 opacity-70"/>
          <span className="text-3xl font-semibold tracking-wide underline underline-offset-2 decoration-4 decoration-blue-300">
            Login
          </span>
        </button>
        <button className="relative size-auto group hover:scale-110 transition-all duration-300" onClick={() => navigate("/signup")}>
          <div className="absolute h-full w-0 group-hover:w-full transition-all duration-300 left-0 bg-blue-300 opacity-70"/>
          <span className="text-3xl font-semibold tracking-wide underline underline-offset-2 decoration-4 decoration-blue-300">
            Signup
          </span>
        </button>
      </div>
    </div>
  );
}