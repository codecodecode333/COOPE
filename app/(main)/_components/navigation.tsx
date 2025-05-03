"use client";

import { cn } from "@/lib/utils";
import { ChevronsLeft, MenuIcon, Plus, PlusCircle, Search, Settings, Trash, User, UserPlus  } from "lucide-react";
import { useRef, useState } from "react";
import UserItem from "./user-item";
import { useMutation } from "convex/react";

import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { useInvite } from "@/hooks/use-invite";

import { api } from "@/convex/_generated/api";
import { Item } from "./item";
import { toast } from "sonner";
import { DocumentList } from "./document-list";
import {useMediaQuery} from 'usehooks-ts'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Navbar } from "./navbar";
import  InviteModal  from "@/components/modals/invite-modal";


export const Navigation = () => {
    const create = useMutation(api.documents.create);

    const sidebarRef = useRef<HTMLElement | null>(null);
    const navbarRef = useRef<HTMLDivElement | null>(null);
    const [isResetting] = useState(false)
    const originalWidthRef = useRef<number>(240); // 원래 너비를 저장하는 ref
    const isMobile = useMediaQuery("(max-width:768px)");
    const [isCollapsed,setIsCollapsed] = useState(!isMobile);
    const { workspaceId } = useParams() as { workspaceId?: string };

    if (!workspaceId) {
    console.log("waiting for hydration...");
    return null;
    }
    
    const search = useSearch();
    const invite = useInvite();
    const settings = useSettings();
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();


    const MIN_WIDTH = 210; // 최소 너비
    const MAX_WIDTH = 700; // 최대 너비

    const handleMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = sidebarRef.current?.getBoundingClientRect().width;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (sidebarRef.current && navbarRef.current) {
                const newWidth = startWidth! + (moveEvent.clientX - startX);
                // 최소 및 최대 너비 적용
                if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                    sidebarRef.current.style.width = `${newWidth}px`;

                    navbarRef.current.style.left = `${newWidth}px`;
                    navbarRef.current.style.width = `calc(100% - ${newWidth + 17}px)`;
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
        setIsCollapsed(prev => {
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

    const handleCreate = () => {
        const promise = create({ title: "Untitled", workspaceId: workspaceId, }).then((documentId) =>
            router.push(`/workspace/${workspaceId}/documents/${documentId}`),
        );

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "New note created!",
            error: "Failed to create a new note."
        });
    };

    const onRedirectFriends = () => {
        toggleSidebar();
        router.push(`/workspace/${workspaceId}/friends`);
    }

    return (
        <>
            <aside 
                ref={sidebarRef}
                className={cn(
                    "group/sidebar h-full bg-black overflow-y-auto relative flex w-60 flex-col z-[99999] rounded-r-xl",
                    isCollapsed ? "w-60" : "w-0",
                    isResetting && "transition-all ease-in-out duration-300"
                    //isMobile && "w-0"
                )}
            >   
                <div className="p-4">
                    <img 
                        src="/logo-dark.png" 
                        alt="Logo" 
                        className="w-44 h-auto ml-2 cursor-pointer hover:opacity-80 transition" 
                        onClick={() => router.push('/')}
                    />
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
                    <Item
                        label="Invite"
                        icon={UserPlus}
                        onClick={invite.onOpen}
                    />
                    {invite.isOpen && (
                    <InviteModal
                    workspaceId={workspaceId}
                    />
                    )}
                    <Item
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={search.onOpen}
                    />
                    <Item
                        label="Settings"
                        icon={Settings}
                        onClick={settings.onOpen}
                    />
                    <Item 
                        onClick={handleCreate} 
                        label="New page"
                        icon= {PlusCircle}
                    />
                </div>
                <div className="mt-4 text-white">
                    <DocumentList/>
                    <Item
                        onClick={handleCreate}
                        label="Add a page"
                        icon={Plus}
                    />

                    <Item icon={User} label="친구" onClick={onRedirectFriends}/>
                    <Popover>
                        <PopoverTrigger className="w-full mt-4">
                            <Item label="Trash" icon={Trash} />
                        </PopoverTrigger>
                        <PopoverContent 
                            className="p-0 w-72"
                            side={isMobile ? "bottom" : "right"}
                        >
                            <TrashBox/>
                        </PopoverContent>
                    </Popover>
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    className="cursor-ew-resize absolute h-full w-1 hover:bg-primary right-0 top-0"
                />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    "absolute top-0 z-[9999]",
                    isResetting && "transition-all ease-in-out duration-300",
                    isCollapsed ? "left-60 w-[calc(100%-257px)]" : "left-0 w-[calc(100%-17px)]"
                )}
            >
                {!!params.documentId ? (
                    <Navbar isCollapsed ={isCollapsed} onResetWidth={toggleSidebar}/>
                ) : (
                <nav className="bg-trasparent px-3 py-2 w-full">
                    {!isCollapsed && 
                        <MenuIcon 
                            role="button" 
                            className="h-6 w-6 text-muted-foreground" 
                            onClick={toggleSidebar}
                        />
                    }
                </nav>
                )}
            </div>
        </>
    )
}