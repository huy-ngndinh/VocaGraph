import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { GrapDataProps, LinkProps, NodeProps } from "./main/type";
import Account from "./main/account";
import Reader from "./main/reader";
import Graph from "./main/graph";
import GraphSvg from "./assets/graph.svg";
import AccountSvg from "./assets/account.svg";
import ReaderSvg from "./assets/reader.svg";

export default function Main() {

  const navigate = useNavigate();

  const [current_tab, set_current_tab] = useState(0);
  const [message, set_message] = useState("");
  const [email, set_email] = useState("");
  const [graph_data, set_graph_data] = React.useState<GrapDataProps>({ nodes: [], links: [] });

  const [cookies,, removeCookie] = useCookies();

  const get_graph = async () => {
    if (!cookies.token) navigate("/login");
    const url = import.meta.env.MODE === "production" ? "https://backend-z770.onrender.com/get_graph" : "http://localhost:3000/get_graph"
    const { data } = await axios.get(url, { withCredentials: true });
    if (!data.status) navigate("/login");
    data.graph_data.nodes.forEach((node: { id: string }) => {
      const new_node: NodeProps = { id: node.id } as NodeProps;
      set_graph_data((current_graph_data) => {
        const new_graph_data = {
          ...current_graph_data,
          nodes: [...current_graph_data.nodes, new_node],
        };
        return new_graph_data;
      })
    });
    data.graph_data.links.forEach((link: { source: string, target: string }) => {
      const new_link: LinkProps = { source: link.source, target: link.target } as LinkProps;
      set_graph_data((current_graph_data) => {
        const new_graph_data = {
          ...current_graph_data,
          links: [...current_graph_data.links, new_link],
        }
        return new_graph_data;
      });
    });
  }

  useEffect(() => {
    get_graph();
  }, []);

  const verify_user = async () => {
    if (!cookies.token) navigate("/login");
    const url = import.meta.env.MODE === "production" ? "https://backend-z770.onrender.com/verify" : "http://localhost:3000/verify"
    const { data } = await axios.post(url, {}, { withCredentials: true });
    if (!data.status) navigate("/login");
    set_email(data.user);
  };

  useEffect(() => {
    verify_user();
  }, []);

  const onClick = (index: number) => {
    set_current_tab(index);
  }

  return (
    <div className="fixed h-screen w-screen p-2 bg-gray-200 flex justify-center">
      <div className={`absolute w-1/4 h-2/25 ${message !== "" ? "top-6": "-top-16"} transition-all duration-500 bg-blue-100 rounded-xl flex justify-center items-center text-xl font-semibold`}>{message}</div>
      <div className="size-full grid grid-cols-16">
        <div className="size-full bg-gray-200 flex flex-col items-end">
          <button 
            className={`w-full aspect-square ${current_tab === 0 ? "bg-blue-50 z-10" : "bg-gray-100"} rounded-l-lg shadow-l flex justify-center items-center`}
            onClick={() => onClick(0)}
          >
            <img src={GraphSvg} alt="Account" className="size-3/5" />
          </button><hr />
          <button 
            className={`w-full aspect-square ${current_tab === 1 ? "bg-blue-50 z-10" : "bg-gray-100"} rounded-l-lg shadow-l flex justify-center items-center`}
            onClick={() => onClick(1)}
          >
            <img src={ReaderSvg} alt="Account" className="size-3/4" />
          </button><hr />
          <button 
            className={`w-full aspect-square ${current_tab === 2 ? "bg-blue-50 z-10" : "bg-gray-100"} rounded-l-lg shadow-l flex justify-center items-center`}
            onClick={() => onClick(2)}
          >
            <img src={AccountSvg} alt="Account" className="size-3/5" />
          </button>
        </div>
        <div className="col-start-2 col-end-17 size-full bg-blue-50 rounded-r-xl rounded-bl-xl shadow-lg">
          { current_tab === 0 && <Graph graph_data={graph_data}/> }
          { current_tab === 1 && graph_data && <Reader graph_data={graph_data} set_graph_data={set_graph_data} set_message={set_message}/> }
          { current_tab === 2 && <Account email={email} removeCookie={removeCookie} />}
        </div>
      </div>
    </div>
  );
};