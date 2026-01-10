import {React,useId} from 'react';
import { forwardRef } from 'react';

function Select({
    option,
    label,
    className,
    ...props
},ref){
    const id=useId();

    return (
        <div className='w-full'>
            {label && (
                <label htmlFor={id} className='block mb-1 font-medium text-gray-700'>
                    {label}
                </label>)}
            <select id={id} ref={ref} className={`px-3 py-2 rounded-3xl bg-amber-300 outline-black focus:bg-gray-50 duration-200 border-gray-500 ${className}`} {...props}>
                {option?option.map((option)=>(
                    <option key={option} value={option}>{option}</option>
                ))
                :null }
            </select>
            
        </div>
    )
}
export default forwardRef(Select);