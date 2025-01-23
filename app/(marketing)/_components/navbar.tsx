"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

const Links = [
    { href:"/notice.tsx", text: '공지사항'},
    { href:"/introduction", text: '회사소개'},
    { href:"/support", text: '고객지원'},
    { href:"/login", text: '로그인'},
]

export const Navbar = () => {
    
    const scrolled = useScrollTop();
    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end
            justify-between w-full flex items-center gap-x-10">
                <nav>
                    <div>
                        <ul className="flex space-x-4 gap-x-10">
                            {
                                Links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="capitalize">
                                        {link.text}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </nav>
                <ModeToggle />
            </div>
        </div>
    )
}