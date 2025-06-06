import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["400", "600"]
});

export const Logo = () => {
    return (
        <div className="md:flex items-center gap-x-2">
            <Image
                src="/logo.png"
                height="200"
                width="200"
                alt="logo"
                className="dark:hidden"
            />
            <Image
                src="/logo-dark.png"
                height="200"
                width="200"
                alt="logo"
                className="hidden dark:block"
            />
        </div>
    )
}