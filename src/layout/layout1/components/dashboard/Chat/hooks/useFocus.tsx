import { useRef } from "react";

const useFocus = (): [React.RefObject<HTMLInputElement>, () => void] => {
  const htmlElRef = useRef<HTMLInputElement>(null);
  const setFocus = () => {htmlElRef.current && htmlElRef.current.focus()};

  return [htmlElRef, setFocus];
};

export default useFocus;
