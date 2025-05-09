// components/Categories.jsx
import { db } from '@/lib/db'
import styles from '@/app/modules/categories.module.css'
import Image from 'next/image'
import Link from 'next/link'

export async function Categories() {
    // Récupérer les catégories
    const result = await db.query('SELECT * FROM categories')
    const categories = result[0]

    return (
        <section id='categories' className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>DECOUVREZ NOS CATÉGORIES DE PRODUITS</h2>
            <div className={styles.categoriesContainer}>
                {categories.map((categorie) => (
                    <Link 
                        href={`/boutique?categorie=${categorie.id}`} 
                        key={categorie.id} 
                        className={styles.categoryCard}
                    >
                        <div className={styles.imageContainer}>
                            <Image
                                src={`/categoriesIMG/${categorie.id}.jpg`}
                                alt={categorie.nom}
                                fill
                                className={styles.categoryImage}
                            />
                        </div>
                        <div className={styles.categoryInfo}>
                            <h3 className={styles.categoryName}>
                                {categorie.nom.toUpperCase()}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}