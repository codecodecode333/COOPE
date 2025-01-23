"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Heading = () => {
    return (
        <div className="max-w-3xl space-y-4">
            <h3 className="text-base sm:text-xl md:text-2xl
            font-medium">
                협업을 새롭게 정의하다
            </h3>
            <Button>
                시작하기
                <ArrowRight className="h-4 w-4 ml-2"/>
            </Button>
        </div>
    )
}