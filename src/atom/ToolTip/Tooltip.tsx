import React, { useState } from "react";
import "./Tooltip.css";

interface Tooltip {
  delay?: any,
  children?: any,
  direction: any,
  content: any,
  onclick?: any,

}
const Tooltip = ({ delay, children, direction, content, onclick }: Tooltip) => {
  let timeout: any;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 200);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="Tooltip-Wrapper rounded"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && onclick && (
        <div className={`Tooltip-Tip ${direction || "top"}`}>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
