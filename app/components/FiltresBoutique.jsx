'use client'
import { useState } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import styles from '@/app/modules/boutique.module.css';

export default function FiltresBoutique({categories}){
   const [query, setQuery] = useState('')
   const [categorie, setCategorie] = useState('')
   const [prix, setPrix] = useState('')

   const searchParams = useSearchParams()
   const {replace} = useRouter()
   const pathname = usePathname()

   function handleSubmit(e){
    e.preventDefault()

    const params = new URLSearchParams(searchParams)

    if(query) {params.set('query', query)} else params.delete('query')
    if(categorie) {params.set('categorie', categorie)} else params.delete('categorie')
    if(prix) {params.set('prix', prix)} else params.delete('prix')

    replace(`${pathname}?${params.toString()}`)
   }

    return (
       <div className={styles.filterContainer}>
          <form onSubmit={handleSubmit} className={styles.filterForm}>
            <div className={styles.inputGroup}>
                <input 
                    className={styles.searchInput} 
                    placeholder="Rechercher un produit.." 
                    type="text" 
                    name="query" 
                    value={query} 
                    onChange={(e)=>{setQuery(e.target.value)}}
                />
                <select 
                    className={styles.selectInput} 
                    name="categorie" 
                    value={categorie} 
                    onChange={(e)=>{setCategorie(e.target.value)}}
                >
                    <option value="">Catégorie</option>
                    {categories.map((cat)=> (
                       <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                </select>

                <select 
                    className={styles.selectInput} 
                    name="prix" 
                    value={prix} 
                    onChange={(e)=>{setPrix(e.target.value)}}
                >
                    <option value="">Trier par prix</option>
                    <option value="asc">Prix croissant</option>
                    <option value="desc">Prix décroissant</option>
                </select>

                <button type="submit" className={styles.submitButton}>
                    Rechercher
                </button>
            </div>
          </form>
       </div>
    )
}