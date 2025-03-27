import FiltresBoutique from "@/components/FiltresBoutique";
import { db } from "@/lib/db";
import { fetchProduits } from "@/lib/products";
import styles from '@/app/modules/boutique.module.css';
import Image from 'next/image';

async function fetchCategories(){
    try {
        const data = await db.query('SELECT * FROM categories')
        return data[0]
    } catch(err) {
        console.error(err)
        return []
    }
}

export default async function BoutiquePage(props) {
    const categories = await fetchCategories()

    const searchParams = await props.searchParams
    const query = searchParams.query || "";
    const categorie = searchParams.categorie || "";
    const prix = searchParams.prix || "";

    const produits = await fetchProduits(query, categorie, prix)
    const currentDate = new Date()
    const oneMonthAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate())

    return (
        <div className={styles.pageContainer}>

            <div className={styles.banniereContainer} >
              <Image className={styles.banniere} alt="boutique banniere" width={1480} height={500}  src={'/banniere-boutique.jpg'}/>
            </div>

            <h1 className={styles.pageTitle}>DECOUVREZ NOS PRODUITS !</h1>
            <FiltresBoutique categories={categories} />

            <div className={styles.productGrid}>
                {produits.map(produit => {
                    const isNew = new Date(produit.timestamp) > oneMonthAgo

                    return (
                        <div key={produit.id} className={styles.productCard}>
                            {isNew && <div className={styles.newLabel}>Nouveau</div>}
                            <div className={styles.productImageContainer}>
                                <Image 
                                    src={produit.photo} 
                                    alt={produit.nom} 
                                    fill 
                                    className={styles.productImage}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                            <div className={styles.productInfo}>
                                <p className={styles.productCategory}>
                                    {produit.categorie_id === 3 ? 'Soins du corps' : 'Soins du visage'}
                                </p>
                                <p className={styles.productName}>{produit.nom}</p>
                                <div className={styles.productPriceContainer}>
                                    <span className={styles.productPrice}>{produit.prix} DA</span>
                                    <button className={styles.buyButton}>🛒</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}