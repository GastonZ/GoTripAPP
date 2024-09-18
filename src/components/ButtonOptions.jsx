import React from 'react'

const ButtonOptions = ({ text }) => {
    return (
        <button className='bg-primary-blue hover:bg-primary-lightBlue px-6 py-2 rounded-lg text-2xl transition-all'>
            {text}
        </button>
    )
}

export default ButtonOptions