import React, { useState, useRef } from "react";
import { FiChevronDown } from "react-icons/fi";

function Dropdown({ items = [], label = "Species" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleBlur = (e) => {
    const next = e.relatedTarget;
    if (!wrapperRef.current?.contains(next)) {
      setOpen(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block m-3"
      onBlur={handleBlur}
    >
      <button
        type="button"
        tabIndex={0}
        className="btn m-1 inline-flex items-center gap-2"
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <FiChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <ul className="absolute mt-2 bg-black rounded-lg shadow-sm w-52 p-2 z-10">
          {items.map((item, i) => (
            <li key={i}>
              <button
                type="button"
                className="w-full text-left p-2 hover:bg-base-200"
                onClick={() => setOpen(false)} // closes after selection
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;