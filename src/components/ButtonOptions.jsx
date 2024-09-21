import React from 'react'

const ButtonOptions = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className='bg-primary-blue hover:bg-primary-lightBlue px-6 py-2 rounded-lg min-w-[300px] text-2xl text-white hover:text-black transition-all'>
            {text}
        </button>
    )
}

export default ButtonOptions