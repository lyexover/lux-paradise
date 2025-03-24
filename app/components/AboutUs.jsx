// components/AboutUs.jsx
import styles from '@/app/modules/aboutus.module.css'
import Image from 'next/image'

export function AboutUs() {
    return (
        <section className={styles.aboutSection}>
            <h2 className={styles.sectionTitle}>À PROPOS DE LUX-PARADISE</h2>
            <div className={styles.aboutContainer}>
                <div className={styles.imageContainer}>
                    <Image
                        src="/aboutIMG.jpg"
                        alt="LUX-PARADISE Cosmétique"
                        fill
                        className={styles.aboutImage}
                    />
                </div>
                <div className={styles.textContainer}>
                    <p className={styles.aboutText}>
                        LUX-PARADISE est une marque de cosmétiques d'exception née de la passion pour la beauté et le bien-être. 
                        Nous croyons que chaque individu mérite de se sentir sublimé au quotidien, grâce à des produits qui 
                        allient qualité supérieure, ingrédients soigneusement sélectionnés et innovation constante.
                    </p>
                    <p className={styles.aboutText}>
                        Notre mission est d'offrir une expérience sensorielle unique à travers nos gammes de soins du visage, 
                        du corps, d'hygiène et de protection solaire. Chez LUX-PARADISE, nous mettons un point d'honneur à 
                        respecter votre peau et l'environnement, en privilégiant des formules respectueuses et efficaces.
                    </p>
                    <p className={styles.aboutText}>
                        Rejoignez-nous dans ce voyage vers une beauté authentique et rayonnante. Avec LUX-PARADISE, 
                        le luxe devient votre paradis quotidien.
                    </p>
                </div>
            </div>
        </section>
    )
}