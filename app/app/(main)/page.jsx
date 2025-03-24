import Banniere from "@/components/Banniere";
import { Nouveautes } from "@/components/Nouveautes";
import { Categories } from "@/components/Categories";
import { AboutUs } from "@/components/AboutUs";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
       <div>
        <Banniere />
        <Categories/>
        <Nouveautes />
        <AboutUs/>
        <Footer/>

       </div>
  );
}
