import Header from "@/components/Header";
import { Footer } from "@/components/Footer";


export default function mainLayout({ children }) {

  return (
    <>
        <Header />
        <div className="main-content" >
        {children}
        </div>
        <Footer/>
   </>
  );
}
