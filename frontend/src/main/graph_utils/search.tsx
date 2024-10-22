import React, { useState } from "react";
import { ForceGraphRefProps, GrapDataProps } from "../type";
import SearchSVG from "../../assets/search.svg";

type Props = {
  memoized_graph_data: GrapDataProps,
  graph_ref: React.MutableRefObject<ForceGraphRefProps | undefined>,
  children?: React.ReactNode
}

export default function Search({ memoized_graph_data, graph_ref }: Props) {
  const [hover, set_hover] = useState(false);
  const [word, set_word] = useState("");
  const [search, set_search] = useState(false);

  const on_change = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_word(event.target.value);
  }

  const on_key_down = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && word.length && !search) {
      set_search(true);
      find_value();
      set_search(false);
    }
  }

  const find_value = () => {
    const index = memoized_graph_data.nodes.findIndex((node) => node.id === word);
    if (index === -1) return;
    const node = memoized_graph_data.nodes[index];
    if (graph_ref !== undefined && node.x && node.y) {
      graph_ref.current?.centerAt(node.x, node.y, 3000);
    }
  }

  return (
    <button 
      className={`absolute top-3 right-3 h-2/25 ${hover ? "aspect-[10/3]": "aspect-square"} transition-all duration-300 bg-blue-300 rounded-md flex justify-center items-center`} 
      onMouseEnter={() => set_hover(true)}
      onMouseLeave={() => set_hover(false)}
    >
      {!hover ? 
        <img src={SearchSVG} alt="Search" className="size-3/4"/> :
        <input 
          className="size-full rounded-lg focus:outline-none border-blue-300 border-2 text-lg pl-3" 
          placeholder="Word to find..."
          value={word} 
          onChange={(event) => on_change(event)}
          onKeyDown={(event) => on_key_down(event)}
        />
      }
    </button>
  );
}