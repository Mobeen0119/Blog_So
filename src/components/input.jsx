import React , {useId} from 'react';

 const Input=React.forwardRef(function Input({
    label,type='text',className='',...props
},ref
){
    const id=useId();
    return (
        <div className='w-full'>
        {label && (
            <label htmlFor={id} className='block mb-1 font-medium text-white'>
                {label}
                </label>)}
      <input type={type} className={` px-3 py-2 rounded-3xl bg-gray-800 text-white placeholder-gray-400 outline-none focus:bg-gray-700 duration-200 border border-gray-600 focus:border-blue-500 ${className}`}
      ref={ref}  {...props} id={id}/>
        </div>

    )
});
export default Input;