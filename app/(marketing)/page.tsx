import { Heading } from "./_components/heading"
import { Heroes } from "./_components/heroes";

const MarketingPage = () =>{
  
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center
      md:justify-start text-center gap-y-8 flex-1 px-6 pb-10">
        <Heading />
        <Heroes /> 
        <div className="ocean">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
      </div> 
    </div>
  );
}

export default MarketingPage;