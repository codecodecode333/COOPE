import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className="h-full dark:bg-[#1F1F1F]">
            <Navbar />
            <main className="flex-grow pt-40 pb-20">
              {children}       
            </main> 
            <Footer />
        </div>
     );
}
 
export default MarketingLayout;