import React  from "react";

export default function Button({ children, type='button', bgColor='bg-blue-300', className='', onClick, ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition ${bgColor} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
