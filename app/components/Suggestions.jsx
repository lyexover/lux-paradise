'use client'

import styles from '@/app/modules/suggestions.module.css'
import Image from "next/image"
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Suggestion({ id, categorie }) {
    const [categories, setCategories] = useState([])
    const [produits, setProduits] = useState([])

    useEffect(() => {
        async function fetchData() {
            try {
                const [categorieResponse, produitsResponse] = await Promise.all([
                    fetch('http://localhost:3000/api/categories'),
                    fetch('http://localhost:3000/api/produits')
                ])

                if (!categorieResponse.ok || !produitsResponse.ok) {
                    throw new Error('Failed to fetch data')
                }

                const categoriesData = await categorieResponse.json()
                const produitsData = await produitsResponse.json()

                console.log(produitsData)

                setCategories(categoriesData)
                setProduits(produitsData.filter(p => p.categorie_id === categorie).slice(0, 4))
            } catch (err) {
                console.error('Error fetching data:', err)
            }
        }

        fetchData()
    }, [categorie])

    const nomCategories = new Map(categories.map(element => [element.id, element.nom]))

    return (
        <div className={styles.container}>
            <h2>DANS LA MÊME CATÉGORIE</h2>
            <div className={styles.produits}>
            {produits.filter(p => p.id != id).map(produit => (
                <Link href={`/boutique/${produit.id}`} className={styles.card} key={produit.id}>
                    <div className={styles.left}>
                        {produit.disponibilite != 1 ? (
                            <p className={styles.nonDispo}>NON DISPONIBLE</p>
                        ) : (
                            <p className={styles.dispo} >DISPONIBLE</p>
                        )}
                        <p className={styles.categorie}>{nomCategories.get(produit.categorie_id)}</p>
                        <p className={styles.nom}>{produit.nom}</p>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.imgContainer}>
                            <Image 
                            className={styles.image}
                                src={produit.photo} 
                                alt={produit.nom} 
                                width={100} 
                                height={100} 
                            />
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        </div>
    )
}