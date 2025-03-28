import styles from '@/app/modules/produit.module.css';
import { db } from "@/lib/db";
import Image from 'next/image';
import { TicketCheck, TicketX, Gem, Star } from 'lucide-react';

export default async function ProductDetailsPage({ params }) {
  const { id_produit } = await params; // Récupération de l'ID produit
  const query = 'SELECT * FROM produits WHERE id = ?';
  const result = await db.query(query, [id_produit]);
  const produit = result[0][0]; // Vérifie que result[0][0] est correct selon ta DB

  const date = new Date();
  const dateCreation = new Date(produit.timestamp);
  const nouveaute = date.getFullYear() === dateCreation.getFullYear() && date.getMonth() === dateCreation.getMonth();

  console.log(produit);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{produit.nom}</h1>
        
      </div>

      <div className={styles.productContainer}>

        <div className={styles.left}>
           <div className={styles.imageContainer}>
             <Image src={produit.photo} width={400} height={400} alt={produit.nom} />
           </div>
        </div>

        <div className={styles.textContainer}>
          <p>{produit.description}</p>

          <div className={styles.badges}>
            {nouveaute && (
              <div className={`${styles.badge} ${styles.newBadge}`}>
                Nouveau
              </div>
            )}
            {produit.vegan && (
              <div className={`${styles.badge} ${styles.veganBadge}`}>
                Végan
              </div>
            )}
          </div>

          <div className={styles.disponibilite}>
            <p className={styles.disponibTitle}>Disponibilité :</p>
            <div className={styles.disponibleCard} >
              {produit.disponibilite ? <TicketCheck /> : <TicketX />}
              {produit.disponibilite ? <p>Disponible</p> : <p>Non Disponible</p>}
            </div>
          </div>

          <div className={styles.badges}>
            <div className={`${styles.badge} ${styles.qualityBadge}`}>
              <Gem /> Haute Qualité
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}