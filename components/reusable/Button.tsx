import React from "react";

type ButtonProps = {
  children: JSX.Element;
  onClick?: (e?: any) => void;
  disabled?: boolean;
};

const Button = React.forwardRef(
  ({ children, onClick, disabled }: ButtonProps, ref) => {
    return (
      <div
        className={`relative inline-block group text-center w-full`}
        // ref={() => ref}
      >
        <button
          type="button"
          onClick={disabled ? () => {} : onClick}
          className={`${
            disabled
              ? "bg-white/10 text-white/40 cursor-not-allowed"
              : "border-gradient-btn"
          } gradient-border-2 rounded-lg px-4 py-2 font-bold items-center justify-center transition-colors duration-300 z-[60] text-sm md:text-base w-full`}
        >
          {children}
        </button>
      </div>
    );
  }
);

export default Button;
