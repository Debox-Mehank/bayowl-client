import React from "react";

type ButtonProps = {
  children: JSX.Element;
  onClick?: (e?: any) => void;
  disabled?: boolean;
};

function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <div className={`relative inline-block group text-center w-full`}>
      {/* <div className="p-4 z-40 absolute inset-0.5 bg-gradient-to-br from-pink-600 to-blueGradient-3 rounded-lg blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div> */}
      <button
        onClick={onClick}
        className={`${
          disabled
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "border-gradient-btn"
        } gradient-border-2 rounded-lg px-4 py-2 font-bold items-center justify-center transition-colors duration-300 z-[60] text-sm md:text-base w-full`}
      >
        {children}
      </button>
      {/* <button
        className={`${disabled ? " text-white/40 cursor-not-allowed" : ""} border-2 border-primary/60 bg-gray-400/5 rounded-lg px-4 py-2 font-bold items-center justify-center transition-colors duration-300 z-[60] text-sm md:text-base`}
      >
        {children}
      </button> */}
    </div>
  );
}

export default Button;
