import Banniere from "@/components/Banniere";
import { Nouveautes } from "@/components/Nouveautes";
import { Categories } from "@/components/Categories";
import { AboutUs } from "@/components/AboutUs";


export default function Home() {
  return (
       <div>
        <Banniere />
        <Categories/>
        <Nouveautes />
        <AboutUs/>
        

       </div>
  );
}
