"use client"

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";
import { Spinner } from "@/components/spinner";
import { useClerk } from '@clerk/clerk-react';  // useClerk 훅 사용

import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const Links = [
    { href:"/notice.tsx", text: '공지사항'},
    { href:"/introduction", text: '회사소개'},
    { href:"/support", text: '고객지원'},
    { href:"/login", text: '로그인'},
]

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrolled = useScrollTop();

    const { signOut } = useClerk();  // useClerk 훅을 사용하여 signOut 메서드 가져오기

    const handleSignOut = () => {
        signOut().then(() => {
            // 로그아웃 후 리디렉션
            window.location.href = '/';  // 원하는 URL로 리디렉션
        });
    };

    return (
        <div className={cn(
            "z-50 bg-background dark:bg-[#1F1F1F] fixed top-0 flex items-center w-full p-6",
            scrolled && "border-b shadow-sm"
        )}>
            <Logo />
            <div className="md:ml-auto md:justify-end
            justify-between w-full flex items-center gap-x-10">
                {isLoading && (
                    <Spinner />
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button variant="ghost" size="sm">
                                Log in
                            </Button>
                        </SignInButton>
                        <SignInButton mode="modal">
                            <Button size="sm">
                                Get Coope free
                            </Button>
                        </SignInButton>
                    </>
                )}
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
                {isAuthenticated && !isLoading && (
                    <>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/documents">
                                Enter Coope
                            </Link>
                        </Button>
                        <UserButton />
                    </>
                )}
                <ModeToggle />
            </div>
        </div>
    )
}