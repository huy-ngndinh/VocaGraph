import { CookieSetOptions } from "universal-cookie";
interface Props {
    email: string;
    removeCookie: (name: string, options?: CookieSetOptions) => void;
}
export default function Account({ email, removeCookie }: Props): import("react/jsx-runtime").JSX.Element;
export {};
