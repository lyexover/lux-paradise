import Header from "@/components/Header";


export default function mainLayout({ children }) {

  return (
    <>
        <Header />
        {children}
   </>
  );
}
