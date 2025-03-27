'use client'
import { useState } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"


export default function FiltresBoutique({categories}){

   const [query, setQuery] = useState('')
   const [categorie, setCategorie] = useState('')
   const [prix, setPrix] = useState('')

   const searchParams = useSearchParams()
   const {replace} = useRouter()
   const pathname = usePathname()
   


   function handleSubmit(e){
    e.preventDefault()

    const params = new URLSearchParams(searchParams)   // creer un container pour la data sous forme d'url, pour ne pas le gerer manuellement 

    if(query) {params.set('query', query)} else params.delete('query')
    if(categorie) {params.set('categorie', categorie)} else params.delete('categorie')
    if(prix) {params.set('prix', prix)} else params.delete('prix')

    replace(`${pathname}?${params.toString()}`)  //naviguer vers notre composant parent en lui passant les params

   }


    return (
       <div>
          <form onSubmit={handleSubmit} >
            <input placeholder="Rechercher un produit.." type="text" name="query" value={query} onChange={(e)=>{setQuery(e.target.value)}}/>
            <select name="categorie" value={categorie} onChange={(e)=>{setCategorie(e.target.value)}} >
                <option value="">Selectionnez une categorie</option>
                {
                    categories.map((cat)=> {
                       return <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    })
                }
            </select>

            <select name="prix" value={prix} onChange={(e)=>{setPrix(e.target.value)}} >
                <option value="">Trier par prix</option>
                <option value="asc">Prix croissant</option>
                <option value="desc">Prix decroissant</option>
            </select>

            <button type="submit" >Valider</button>
          </form>
       </div>
    )
}