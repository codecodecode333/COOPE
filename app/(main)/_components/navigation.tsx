"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon } from "lucide-react";
import { useRef, useState } from "react";
import UserItem from "./user-item";

export const Navigation = () => {

    const isresizingRef = useRef(false);
    const sidebarRef = useRef<HTMLElement | null>(null);
    const navbarRef = useRef<HTMLDivElement | null>(null);
    const [isResetting, setIsResetting] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const originalWidthRef = useRef<number>(240); // 원래 너비를 저장하는 ref

    const MIN_WIDTH = 210; // 최소 너비
    const MAX_WIDTH = 700; // 최대 너비

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = sidebarRef.current?.getBoundingClientRect().width;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (sidebarRef.current) {
                const newWidth = startWidth! + (moveEvent.clientX - startX);
                // 최소 및 최대 너비 적용
                if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                    sidebarRef.current.style.width = `${newWidth}px`;
                }
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const toggleSidebar = () => {
        setIsSidebarVisible(prev => {
            if (prev) {
                // 사이드바를 숨길 때 점진적으로 너비를 줄임
                let currentWidth = sidebarRef.current!.getBoundingClientRect().width;
                const interval = setInterval(() => {
                    if (currentWidth > 0) {
                        currentWidth -= 10; // 5px씩 줄임
                        sidebarRef.current!.style.width = `${currentWidth}px`;
                    } else {
                        sidebarRef.current!.style.width = `0px`
                        clearInterval(interval);
                    }
                }, 1); // 10ms마다 실행
            } else {
                // 사이드바를 다시 보일 때 점진적으로 너비를 늘림
                let currentWidth = 0; // 시작 너비
                sidebarRef.current!.style.width = '0'; // 초기 너비를 0으로 설정
                const interval = setInterval(() => {
                    if (currentWidth < originalWidthRef.current) {
                        currentWidth += 10; // 5px씩 늘림
                        sidebarRef.current!.style.width = `${currentWidth}px`;
                    } else {
                        clearInterval(interval);
                    }
                }, 1); // 10ms마다 실행
            }
            return !prev;
        });
    };

    return (
        <>
            <aside 
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-black overflow-y-auto relative flex w-60 flex-col z-[99999] rounded-r-xl",
                    isSidebarVisible ? "w-60" : "w-0",
                    isResetting && "transition-all ease-in-out duration-300"
                    //isMobile && "w-0"
                )}
            >   
                <div className="p-4">
                    <img src="/logo-dark.png" alt="Logo" className="w-44 h-auto ml-2" />
                </div>
                <div 
                    role="button"
                    className="h-6 w-6 text-muted-foreground rounded-sm
                    hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute
                    top-3 right-2 opacity-0 group-hover/sidebar:opacity-100
                    transition"
                    onClick={toggleSidebar}
                >
                    <ChevronsLeft className="h-6 w-6" />
                </div>
                <div>
                    <UserItem/>
                </div>
                <div className="mt-4">
                    <p className="text-white">Documents</p>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    className="cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[99999] left-60 w-[calc(100%-249px)]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isSidebarVisible ? "left-60" : "left-0"
                )}
            >
                <nav className="bg-trasparent px-3 py-2 w-full">
                    {!isSidebarVisible && (
                        <MenuIcon 
                            role="button" 
                            className="h-6 w-6 text-muted-foreground" 
                            onClick={toggleSidebar}
                        />
                    )}
                </nav>
            </div>
        </>
    )
}