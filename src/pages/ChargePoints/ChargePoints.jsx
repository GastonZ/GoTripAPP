import { ArrowLeftCircleIcon, BackwardIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import React from 'react'

const ChargePoints = () => {
    return (
        <div className='flex justify-center items-center w-full h-screen'>
            <Link to={'/opciones'}>
                <ArrowLeftCircleIcon className='top-28 left-3 absolute bg-primary-blue p-4 rounded-full w-20 h-20 object-contain' />
            </Link>
            <iframe src="https://www.google.com/maps/d/embed?mid=1hK9CZXa8JLfZ9jSoS3IfbHfAoYLQNq0&ehbc=2E312F" className='w-full h-full'></iframe>
        </div>
    )
}

export default ChargePoints