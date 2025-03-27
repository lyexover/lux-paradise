import FiltresBoutique from "@/components/FiltresBoutique";
import { db } from "@/lib/db";
import { fetchProduits } from "@/lib/products";


//fonction qui recupere les categories, on va les passer a filtresBoutique
async function fetchCategories(){
    try{
      const data = await db.query('SELECT * FROM categories')
      return data[0]
}
catch(err){
    console.error(err)
}}



export default async function page(props){

    const categories = await fetchCategories()

    const searchParams = await props.searchParams
    // Récupère les searchParams
  const query = searchParams.query || "";
  const categorie = searchParams.categorie || "";
  const prix = searchParams.prix || "";

   const produits = await fetchProduits(query, categorie, prix)
  console.log(produits)

    return (
        <div>
            <FiltresBoutique categories={categories} />

            <div>
                {
                    produits.map(produit=> (
                        <h3 key={produit.id} >{produit.nom}</h3>
                    ))
                }
            </div>
        </div>
    )

}