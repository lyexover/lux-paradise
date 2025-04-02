import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import BreadCrumbs from "@/components/BreadCrumbs";
import CartProvider from "../context/cartContext";


export default function mainLayout({ children }) {

  return (
    <>
    <CartProvider>
        <Header />
        <BreadCrumbs/>
        <div className="main-content" >
        {children}
        </div>
        <Footer/>
     </CartProvider>
   </>
  );
}
