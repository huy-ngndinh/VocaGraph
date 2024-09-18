import React, { useEffect, useState } from "react";
import mammoth from "mammoth";
import axios from "axios";
import { dictionary, GrapDataProps, NodeProps, LinkProps } from "./type";
import Download from "../assets/download.svg";

type Props = {
  graph_data: GrapDataProps,
  set_graph_data: React.Dispatch<React.SetStateAction<GrapDataProps>>,
  set_message: React.Dispatch<React.SetStateAction<string>>,
  children?: React.ReactNode
}

export default function Reader({ graph_data, set_graph_data, set_message }: Props) {

  const [content, set_content] = useState("");
  const [selected_text, set_selected_text] = useState("");
  const [pending, set_pending] = useState(false);
  const [add_display, set_add_display] = useState(false);
  const [definition, set_definition] = React.useState<dictionary|null>(null);
  const textarea_ref = React.useRef<HTMLTextAreaElement>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [update_finished, set_update_finished] = React.useState<boolean>(false);
  const [new_nodes, set_new_nodes] = React.useState<{ id: string, group: string }[]>([]);
  const [new_links, set_new_links] = React.useState<{ source: string, target: string }[]>([]);

  const reset = () => {
    set_definition(null);
    set_add_display(false);
    setInputValue("");
    setTags([]);
  }

  const onTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    set_content(event.target.value);
  }

  const onTextSelect = () => {
    const textarea = textarea_ref.current;
    const selection_start = textarea?.selectionStart;
    const selection_end = textarea?.selectionEnd;
    if (selection_start === undefined || selection_end === undefined) return;
    const text = textarea?.value.substring(selection_start, selection_end);
    if (text) set_selected_text(text);
    else reset();
  }

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    const file = event.target.files[0];
    const [data, error] = await get_file_content(file);
    if (data) {
      set_content(data);
    } else {
      console.error(error);
    }
  }

  const get_file_content = async (file: File): Promise<[string | null, unknown]> => {
    try {
      const file_buffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: file_buffer });
      return [result.value, null];
    } catch (error) {
      return [null, error];
    }
  }

  const lookup = async() => {
    set_pending(true);
    const [data, error] = await get_word_definition();
    set_pending(false);
    if (data) {
      reset();
      set_definition(data);
    } else {
      console.log(error);
    }
  }

  const get_word_definition = async (): Promise<[dictionary | null, unknown]> => {
    try {
      const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + selected_text;
      const response = await axios.get(url);
      const data: dictionary = response.data;
      return [data, null];
    } catch(error) {
      return [null, error];
    }
  }

  const displayOption = () => {
    reset();
    set_add_display(true);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const add_node = (tag: string) => {
    const index = graph_data.nodes.findIndex((node: NodeProps) => node.id === tag);
    if (index !== -1) return;
    set_graph_data((current_graph_data) => {
      const new_node: NodeProps = { id: tag } as NodeProps;
      const new_graph_data = {
        ...current_graph_data,
        nodes: [...current_graph_data.nodes, new_node]
      };
      return new_graph_data;
    })
    set_new_nodes((current_nodes) => {
      const new_nodes = [...current_nodes, { id: tag, group: "none" }];
      return new_nodes;
    })
  }

  const add_link = (source: string, target: string) => {
    const index = graph_data.links.findIndex((link) => {
      const current_source = typeof link.source === "object"? (link.source as { id: string }).id : link.source;
      const current_target = typeof link.target === "object"? (link.target as { id: string }).id : link.target;
      if (current_source === source && current_target === target) return true;
      else if (current_source === target && current_target === source) return true;
      else return false;
    })
    if (index !== -1) return;
    set_graph_data((current_graph_data) => {
      const new_link: LinkProps = { source: source, target: target } as LinkProps
      const new_graph_data = {
        ...current_graph_data,
        links: [...current_graph_data.links, new_link],
      };
      return new_graph_data;
    });
    set_new_links((current_link) => {
      const new_link = [...current_link, { source: source, target: target }];
      return new_link;
    });
  }

  const onSubmit = () => {
    set_pending(true);
    add_node(selected_text);
    tags.forEach((tag) => add_node(tag));
    tags.forEach((tag) => add_link(selected_text, tag));
    set_update_finished(true);
  }

  const update_graph = async () => {
    try {
      const url = import.meta.env.MODE === "production" ? "https://backend-z770.onrender.com/update_graph" : "http://localhost:3000/update_graph"
      const { data } = await axios.post(url, { new_nodes, new_links }, { withCredentials: true });
      return [data, null];
    } catch(error) {  
      return [null, error];
    }
  }

  useEffect(() => {
    const perform_update = async () => {
      if (update_finished) {
        const [data, error] = await update_graph();
        if (error) return console.error(error);
        set_message(data.message);
        const timeout = setTimeout(() => {
          set_message("");
          set_new_nodes([]);
          set_new_links([]);
          reset();
          set_pending(false);
          set_update_finished(false);
        }, 3000);
        return () => clearTimeout(timeout);
      }
    }
    perform_update();
  }, [update_finished]);
    
  
  return (
    <div className="size-full p-2 grid grid-cols-3 gap-2">
      <textarea 
        ref={textarea_ref}
        className="col-start-1 col-end-3 size-full p-2 bg-transparent rounded-md border-1 border-light-blue/60 focus:outline-none resize-none overflow-y-auto"
        value={content}
        placeholder="Write something!"
        onChange={onTextChange}
        onSelect={onTextSelect}
        disabled={pending}
      />
      <div className="col-start-3 col-end-3 flex flex-col justify-end items-center gap-2">
        <div className="h-2/3 w-full rounded-md p-2 border-1 border-light-blue/60 flex flex-col items-center gap-2">
          <div className="h-1/10 w-full flex flex-row items-center gap-2">
            { selected_text && <>
              <div className="h-full w-1/2 flex justify-center items-center">{selected_text}</div>
              <div className="h-full w-0 border-1 border-dashed border-light-blue "/>
              <button className="h-full w-1/4 bg-blue-100 rounded-lg hover:scale-105 transition-all" onClick={() => lookup()} disabled={pending}>Look up</button>
              <button className="h-full w-1/4 bg-blue-100 rounded-lg hover:scale-105 transition-all" onClick={() => displayOption()} disabled={pending}>Add</button>
            </>}
          </div>
          <div className="w-full h-0 border-1 border-dashed border-light-blue/60"/>
          { definition && definition.length && <div className="h-0 min-h-9/10 w-full flex flex-col items-center gap-2 overflow-y-auto">
            {definition[0].meanings.map((meaning) => {
              return (
                <div key={Math.random()} className="w-full p-2 rounded-lg bg-blue-200 flex flex-col gap-2">
                  <div className="capitalize font-bold text-blue-500">{meaning.partOfSpeech}</div>
                  <div className="w-full h-0 border-1 border-dashed border-light-blue"/>
                  {meaning.definitions.map((definition, index) => {
                    return (
                      <div key={Math.random()}>
                        <div className="font-bold">[{index+1}]</div> {definition.definition}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>}
          { add_display && <div className="relative h-0 min-h-9/10 w-full p-2 flex flex-col items-center gap-2 overflow-auto">
              <div className="text-lg font-semibold text-blue-500 capitalize">{selected_text}</div>
              <div className="w-full underline decoration-2 decoration-blue-300 decoration-wavy">Related words </div>
              <div className="w-full flex flex-wrap items-center gap-1">
                {tags.map((tag, index) => {
                  return (
                    <button key={Math.random()} onClick={() => removeTag(index)} className="pt-1 pb-1 pl-4 pr-4 border-2 border-blue-300 rounded-lg bg-blue-300">
                      {tag}
                    </button>
                  );
                })}
                <input 
                  type="text"
                  value={inputValue}
                  className="w-1/3 pt-1 pb-1 pl-2 border-2 border-blue-300 rounded-lg focus:outline-none"
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event)}
                  placeholder="Tag..."
                />
              </div>
              <button className="w-1/3 p-1.5 bg-blue-400 rounded-lg font-semibold hover:scale-105 transition-all" onClick={() => onSubmit()} disabled={pending}>Submit</button>
          </div>}
        </div>
        <form className="h-1/3 w-full rounded-md border-2 border-light-blue/60 border-dashed hover:bg-blue-100 flex justify-center items-center">
          <label className="size-full flex flex-col justify-center items-center">
            <img src={Download} alt="Download" className="size-1/3"/>
            Click to upload or drag and drop
            <input type="file" accept=".doc,.docx" className="hidden" onChange={onChange} disabled={pending}/>
          </label>
        </form>
      </div>
    </div>
  );
}