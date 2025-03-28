import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import BreadCrumbs from "@/components/BreadCrumbs";


export default function mainLayout({ children }) {

  return (
    <>
        <Header />
        <BreadCrumbs/>
        <div className="main-content" >
        {children}
        </div>
        <Footer/>
   </>
  );
}
