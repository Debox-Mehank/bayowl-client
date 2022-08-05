import React, { MouseEventHandler } from "react";

interface EssentialButtonProps {
    title: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
    active: boolean;
}

const EssentialButton = ({ title, onClick, active }: EssentialButtonProps) => {
    return (
        <div
            onClick={onClick}
            className={`text-white text-center font-semibold text-sm shadow-md cursor-pointer rounded-lg py-1.5 px-3 mt-3 lg:py-3 ${active ? "border-gradient-br-blue-green-gray-900 gradient-border-2" : "hover:text-orange1 duration-300 transition-colors"
                }`}
        >
            {title}
        </div>
    );
};

export default EssentialButton;
