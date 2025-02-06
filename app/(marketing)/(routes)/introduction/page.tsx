import React from "react";
import Image from "next/image";
const Introduction = () => {
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                <h1 className="text-4xl font-bold">회사소개</h1>
                <div className="mountain-image">
                    <Image
                        src={"/mountain.jpg"}
                        fill
                        alt="산"
                        className="rounded-lg opacity-90 z-0"
                    />
                    <Image 
                        src={"/moon.png"}
                        width={200}
                        height={200}
                        alt="달"
                        className="z-30 bottom-0 absolute left-52 top-3/4"
                    />
                </div>
                <h2>확인용</h2>
                
            </div>

        </div>
    );
}

export default Introduction;