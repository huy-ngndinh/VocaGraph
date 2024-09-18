import React, { useEffect, useMemo } from "react";
import ForceGraph from "react-force-graph-2d";
import * as d3 from "d3-force";
import { ForceGraphRefProps, GrapDataProps, LinkProps, NodeProps } from "./type";
// import { Node, Link, GraphData } from "./type";

type Props = {
  graph_data: GrapDataProps,
  children?: React.ReactNode
}

export default function Graph({ graph_data }: Props) {

  const container_ref = React.useRef<HTMLDivElement>(null);
  const graph_ref = React.useRef<ForceGraphRefProps | undefined>(undefined);
  const [highlight_node, set_highlight_node] = React.useState<Set<string>>(new Set());
  const [hover_node, set_hover_node] = React.useState<string | null>(null);
  const [dimensions, setDimensions] = React.useState<{ width: number, height: number }>({ width: 800, height: 600 });

  useEffect(() => {
    if (container_ref && container_ref.current) {
      setDimensions({
        width: container_ref.current?.offsetWidth,
        height: container_ref.current?.offsetHeight
      });
    }
  }, [container_ref])

  useEffect(() => {
    if (graph_ref !== undefined) {
      graph_ref.current?.zoom(0.8);
      graph_ref.current?.d3Force("link", d3.forceLink().distance(300));
      graph_ref.current?.d3Force("charge", d3.forceManyBody().strength(-200));
    }
  }, [graph_ref])

  const memoized_graph_data: GrapDataProps = useMemo(() => {
    return graph_data;
  }, [graph_data])

  const adjacent_list: { [key: string]: string[] } = useMemo(() => {
    const data: { [key: string]: string[] } = {};
    graph_data.nodes.forEach((node) => data[node.id] = []);
    graph_data.links.forEach((link) => {
      const source = typeof link.source === "object"? (link.source as { id: string }).id : link.source;
      const target = typeof link.target === "object"? (link.target as { id: string }).id : link.target;
      data[source].push(target);
      data[target].push(source);
    });
    return data;
  }, [graph_data]);

  const nodeCanvasObject = (node: NodeProps, context: CanvasRenderingContext2D, globalScale: number) => {
    // https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-2d.html
    const label = node.id;
    const fontSize = 20/globalScale;
    context.font = `${fontSize}px Sans-Serif`;
    const textWidth = context.measureText(label).width;
    const background_dimension = [textWidth, fontSize].map(n => n + fontSize * 0.4); // some padding

    context.fillStyle = "rgb(239 246 255 / 0)";
    if (node.x === undefined || node.y === undefined) return;
    context.fillRect(node.x - background_dimension[0] / 2, node.y - background_dimension[1] / 2, background_dimension[0], background_dimension[1]);

    context.textAlign = "center";
    context.textBaseline = "middle";
    if (hover_node) {
      if (highlight_node.has(node.id)) {
        context.fillStyle = "#3572EF";
      } else {
        context.fillStyle = "#D2E0FB";
      }
    } else {
      context.fillStyle = node.color;
    }
    context.fillText(label, node.x, node.y);

    node.__background_dimension = background_dimension; // to re-use in nodePointerAreaPaint

  }

  const nodePointerAreaPaint = (node: NodeProps, color: string, context: CanvasRenderingContext2D) => {
    context.fillStyle = color;
    const background_dimension = node.__background_dimension;
    if (node.x === undefined || node.y === undefined) return;
    if (background_dimension) context.fillRect(node.x - background_dimension[0] / 2, node.y - background_dimension[1] / 2, background_dimension[0], background_dimension[1]);
  }

  const linkColor = (link: LinkProps) => {
    if (hover_node) {
      const source = (link.source as { id: string }).id;
      const target = (link.target as { id: string }).id;
      const has_first_node = highlight_node.has(source);
      const has_second_node = highlight_node.has(target);
      const has_hover_node = (source === hover_node) || (target === hover_node);
      if (has_first_node && has_second_node && has_hover_node) return "#A7E6FF";
      else return "#EEEDEB";
    } else {
      return "#D2E0FB";
    }
  }

  const linkWidth = (link: LinkProps) => {
    if (hover_node) {
      // console.log(link.source.id);
      const source = (typeof link.source === "object" && "id" in link.source ? (link.source as { id: string }).id : link.source);
      const target = (typeof link.target === "object" && "id" in link.target ? (link.target as { id: string }).id : link.target);
      const has_first_node = highlight_node.has(source);
      const has_second_node = highlight_node.has(target);
      const has_hover_node = (source === hover_node) || (target === hover_node);
      if (has_first_node && has_second_node && has_hover_node) return 5;
      else return 2;
    } else {
      return 2;
    }
  }

  const onNodeHover = (node: NodeProps | null) => {
    highlight_node.clear();
    set_hover_node(node ? (node as { id: string}).id : null);
    if (node) {
      highlight_node.add(node.id);
      adjacent_list[node.id].forEach((adjacent_node: string) => {
        highlight_node.add(adjacent_node);
      });
    }
    set_highlight_node(highlight_node);
  }

  return (
    <div ref={container_ref} className="relative size-full">
      { memoized_graph_data && <ForceGraph 
        ref={graph_ref}
        graphData={memoized_graph_data} 
        height={dimensions.height}
        width={dimensions.width}
        nodeAutoColorBy={"group"}
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={nodePointerAreaPaint}
        linkColor={linkColor}
        linkWidth={linkWidth}
        onNodeHover={onNodeHover}
      /> }
      {/* <div className="absolute w-1/20 h-auto bottom-3 right-3 flex flex-col justify-end items-center gap-2">
        <button className="w-full aspect-square bg-blue-200 rounded-md">
          +
        </button>
        <button className="w-full aspect-square bg-blue-200 rounded-md">
          +
        </button>
      </div> */}
    </div>
  );
}