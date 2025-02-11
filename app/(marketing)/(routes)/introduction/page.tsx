import React from "react";
import Image from "next/image";
import Link from "next/link";

const Introduction = () => {
    const teamMembers = [
        { id: 1, name: '김민재', role: '풀스택 개발', content: '팀 안전운전의 팀장 김민재입니다. 팀원 소개글의 1번입니다.' },
        { id: 2, name: '문제창', role: '풀스택 개발', content: '팀 안전운전의 팀원 문제창입니다. 팀원 소개글의 2번입니다.' },
        { id: 3, name: '진해령', role: '풀스택 개발', content: '팀 안전운전의 팀원 진해령입니다. 팀원 소개글의 3번입니다.' },
    ]
    return (
        <div className="min-h-full flex flex-col">
            <div className="flex flex-col items-center justify-center
              md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
                {/* <div className="mountain-image">
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
                </div> */}
                <Image
                    src={"/introduction.png"}
                    width={900}
                    height={300}
                    alt="사람"
                />
                
                <div className="w-full px-56 flex-col">
                    <h2 className="text-right text-blue-500 pb-10 text-sm">Designed by Freepik</h2>
                    <h2 className="text-5xl text-start"><span className="text-blue-500">함께</span> 알아가고<br /> 창작하는 것을 돕습니다</h2>
                    <h2 className="text-start font-medium text-lg">간단한 글 작성을 위한 공간부터 다양한 사람들이 협업해야하는 공간까지 <br />
                        우리는 모든 것을 제공합니다.</h2>
                    <h2 className="pt-10 text-4xl">팀원</h2>
                    <div className="grid grid-flow-col items-center justify-center">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="mt-20 mr-5 max-h-screen relative bg-white shadow-lg w-60 h-96 border-2 border-gray-500 flex items-center  flex-col hover:bg-blue-600 hover:text-white rounded-lg">
                                <div className="absolute -top-10">
                                    <Image src={"/universe.jpg"}
                                        className="h-24 w-24 rounded-full object-cover"
                                        alt="프로필사진"
                                        width={96}
                                        height={96} />
                                </div>
                                <div className="mt-16 flex items-center flex-col justify-center">
                                    <h1 className="font-bold text-2xl mt-4">{member.name}</h1>
                                    <p className="font-semibold text-xl text-gray-500">{member.role}</p>
                                    <p className="text-center mt-4">{member.content}</p>
                                </div>
                                <div className="flex flex-row space-x-4 mt-11">
                                    <Link href="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                        </svg>
                                    </Link>
                                    <Link href="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-twitter" viewBox="0 0 16 16">
                                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                                        </svg>
                                    </Link>
                                    <Link href="#">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-linkedin" viewBox="0 0 16 16">
                                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

        </div>
    );
}

export default Introduction;