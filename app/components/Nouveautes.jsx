import { db } from '@/lib/db'
import styles from '@/app/modules/nouveautes.module.css'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export async function Nouveautes() {
    // Récupérer les produits
    const query = 'SELECT * FROM produits ORDER BY id DESC LIMIT 6'
    const result = await db.query(query)
    const produits = result[0]

    // Récupérer les catégories
    const result2 = await db.query('SELECT * FROM categories')
    const categories = result2[0]

    // Créer un map des catégories
    let categoriesMap = {}
    categories.map((categorie) => {
        categoriesMap[categorie.id] = categorie.nom
    })
    
    return (
        <div  id='nouveautes' className={styles.nouveautesSection}>
            <h1 className={styles.sectionTitle}>NOUVEAUX TRÉSORS !</h1>
            <div className={styles.nouveautesContainer}> 
                {produits.map((produit) => (
                    <Link href={`/boutique/${produit.id}`} key={produit.id} className={styles.produitCard}>
                        <div className={styles.imageContainer}>
                            <Image 
                                className={styles.productImage} 
                                width={400} 
                                height={400} 
                                src={produit.photo} 
                                alt={produit.nom} 
                            />
                            <button className={styles.cartButton}>
                                <ShoppingCart size={20} color="white" />
                            </button>
                        </div>
                        <div className={styles.productInfo}>
                            <p className={styles.categoryName}>{categoriesMap[produit.categorie_id]}</p>
                            <p className={styles.productPrice}>{produit.prix} DA</p>
                            <h3 className={styles.productName}>{produit.nom.toUpperCase()}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}