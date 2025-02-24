import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules'
import { carruselImgs } from '../assets'

const Carrusel = () => {
    return (
        <div className="relative shadow-xl my-8 rounded-lg w-full max-w-2xl">
            <Swiper
                loop={true} // Hace el carrusel infinito
                autoplay={{ delay: 3000, disableOnInteraction: false }} // Se mueve automáticamente cada 3 segundos
                navigation={true}
                pagination={{ clickable: true }}
                mousewheel={true}
                keyboard={true}
                modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
                className="rounded-lg w-full"
            >
                {Object.values(carruselImgs).map((imgSrc, index) => (
                    <SwiperSlide key={index}>
                        <img 
                            className="rounded-lg w-full h-[400px] md:h-[500px] object-cover"
                            src={imgSrc}
                            alt={`Carrusel imagen ${index + 1}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Carrusel
