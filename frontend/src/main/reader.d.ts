import React from "react";
import { GrapDataProps } from "./type";
type Props = {
    graph_data: GrapDataProps;
    set_graph_data: React.Dispatch<React.SetStateAction<GrapDataProps>>;
    set_message: React.Dispatch<React.SetStateAction<string>>;
    children?: React.ReactNode;
};
export default function Reader({ graph_data, set_graph_data, set_message }: Props): import("react/jsx-runtime").JSX.Element;
export {};
