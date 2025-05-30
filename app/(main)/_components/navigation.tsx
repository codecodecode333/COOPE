"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
  User,
  UserPlus,
  Home,
} from "lucide-react";
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
import { useMediaQuery } from "usehooks-ts";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { TrashBox } from "./trash-box";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Navbar } from "./navbar";
import InviteModal from "@/components/modals/invite-modal";

export const Navigation = () => {
  // ✅ 모든 훅은 최상단에!
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { workspaceId } = params as { workspaceId?: string };
  const isWorkspacePath = pathname.startsWith("/workspace");
  const isFriendPage = pathname.includes("/friends");

  const search = useSearch();
  const invite = useInvite();
  const settings = useSettings();
  const create = useMutation(api.documents.create);

  const sidebarRef = useRef<HTMLElement | null>(null);
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const [isResetting] = useState(false);
  const originalWidthRef = useRef<number>(240);
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isCollapsed, setIsCollapsed] = useState(!isMobile);

  const MIN_WIDTH = 210;
  const MAX_WIDTH = 700;
  

  // ❗ 조건은 아래에서 처리
  if (isWorkspacePath && !workspaceId) {
    console.log("workspaceId missing in /workspace path");
    return null;
  }

  const safeWorkspaceId = workspaceId!;

  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = sidebarRef.current?.getBoundingClientRect().width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (sidebarRef.current && navbarRef.current) {
        const newWidth = startWidth! + (moveEvent.clientX - startX);
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
    setIsCollapsed((prev) => {
      if (prev) {
        let currentWidth = sidebarRef.current!.getBoundingClientRect().width;
        const interval = setInterval(() => {
          if (sidebarRef.current && navbarRef.current) {
            currentWidth -= 10;
            sidebarRef.current!.style.width = `${currentWidth}px`; 
            navbarRef.current.style.left = `6px`;
            navbarRef.current.style.width = `99%`;
          } else {
            if (sidebarRef.current) sidebarRef.current!.style.width = `0px`; 
            if (navbarRef.current) navbarRef.current.style.left = `6px`;   
            clearInterval(interval);
          }
        }, 1);
      } else {
        let currentWidth = 0;
        sidebarRef.current!.style.width = "0";
        
        const interval = setInterval(() => {
          if (currentWidth < originalWidthRef.current) {
            currentWidth += 10;
            sidebarRef.current!.style.width = `${currentWidth}px`;
          } else {
            if (navbarRef.current) navbarRef.current.style.left = `${currentWidth}px`;
            clearInterval(interval);
          }
        }, 1);
      }
      return !prev;
    });
  };

  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
      workspaceId: safeWorkspaceId,
    }).then((documentId) =>
      router.push(`/workspace/${workspaceId}/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

    const onRedirectFriends = () => {
        toggleSidebar();
        router.push(`/workspace/${workspaceId}/friends`);
    }
    
    const onRedirect = () => {
      router.push(`/workspace/${workspaceId}/documents`)
    }; 

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-black overflow-y-auto overflow-hidden relative flex w-60 flex-col z-[99998] ",
          isCollapsed ? "w-60" : "w-0",
          isResetting && "transition-all ease-in-out duration-300",
          isFriendPage ? "rounded-none" : "rounded-r-lg"
        )}
      >
        <div className="p-4">
          <img
            src="/logo-dark.png"
            alt="Logo"
            className="w-44 h-auto ml-2 cursor-pointer hover:opacity-80 transition"
            onClick={() => router.push("/")}
          />
        </div>
        <div
          role="button"
          className="h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition"
          onClick={toggleSidebar}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item onClick={onRedirect} label="Home" icon={Home} />
          <Item label="Invite" icon={UserPlus} onClick={invite.onOpen} />
          {invite.isOpen && <InviteModal workspaceId={safeWorkspaceId} />}
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
        </div>
        <div className="mt-4 text-white">
          <DocumentList />
          <Item onClick={handleCreate} label="Add a page" icon={Plus} />
          <Item icon={User} label="친구" onClick={onRedirectFriends} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
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
          isCollapsed
            ? "left-60 w-[calc(100%-257px)]"
            : "left-0 w-[calc(100%-17px)]"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={toggleSidebar} />
        ) : (
          <nav className="relative bg-transparent px-3 py-2 w-full">
            {!isCollapsed && (
              <MenuIcon
                role="button"
                className="absolute top-3 h-6 w-6 text-muted-foreground "
                onClick={toggleSidebar}
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
