"use client"
import React, { useRef } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

import useMoveScroll from '@/hooks/useMoveScroll';
const functionPage = () => {
    const functionTabs = Array.from({ length: 5 }, () => useMoveScroll()); //클릭시 그 기능이 위치한 곳으로 스크롤을 이동시키기 위한 배열
    return (
        <div className="min-h-full flex flex-col mb-20">
            <div className="flex flex-col items-center justify-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl font-bold">기능</h1>
                <div>
                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        autoplay={{
                            delay: 2000
                        }}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 50,
                            stretch: 0,
                            depth: 100,
                            modifier: 1,
                            slideShadows: true,
                        }}
                        pagination={true}
                        modules={[Autoplay, EffectCoverflow, Pagination]}
                        className="mySwiper w-5/12"
                    >
                        <SwiperSlide onClick={functionTabs[0].onMoveToElement}>
                            <h3>기능1</h3>
                            <img src="https://swiperjs.com/demos/images/nature-1.jpg" className="rounded-lg" />
                        </SwiperSlide>
                        <SwiperSlide onClick={functionTabs[1].onMoveToElement}>
                            <h3>기능2</h3>
                            <img src="https://swiperjs.com/demos/images/nature-2.jpg" className="rounded-lg" />
                        </SwiperSlide>
                        <SwiperSlide onClick={functionTabs[2].onMoveToElement}>
                            <h3>기능3
                            </h3>
                            <img src="https://swiperjs.com/demos/images/nature-3.jpg" className="rounded-lg" />
                        </SwiperSlide>
                        <SwiperSlide onClick={functionTabs[3].onMoveToElement}>
                            <h3>기능4</h3>
                            <img src="https://swiperjs.com/demos/images/nature-4.jpg" className="rounded-lg" />
                        </SwiperSlide>
                        <SwiperSlide onClick={functionTabs[4].onMoveToElement}>
                            <h3>기능5</h3>
                            <img src="https://swiperjs.com/demos/images/nature-5.jpg" className="rounded-lg" />
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div ref={functionTabs[0].element}>
                    <h1 className="text-3xl font-bold">기능1</h1>
                </div>
                <div ref={functionTabs[1].element}>
                    <h1 className="text-3xl font-bold">기능2</h1>
                </div>
                <div ref={functionTabs[2].element}>
                    <h1 className="text-3xl font-bold">기능3</h1>
                </div>
                <div ref={functionTabs[3].element}>
                    <h1 className="text-3xl font-bold">기능4</h1>
                </div>
                <div ref={functionTabs[4].element}>
                    <h1 className="text-3xl font-bold">기능5</h1>
                </div>
            </div>
        </div>
    );
}

export default functionPage;