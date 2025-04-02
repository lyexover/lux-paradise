"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import useParams
import Image from "next/image";
import styles from "@/app/modules/produit.module.css";
import { TicketCheck, TicketX, Gem, ShoppingBasket } from "lucide-react";
import Suggestion from "@/components/Suggestions";
import { useCart } from "@/app/context/cartContext";

export default function ProductDetailsPage() {
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {cartLength, setCartLength} = useCart()

  const params = useParams(); // Use the hook to get route parameters
  const id = params?.id_produit; // Extract the 'id' from the dynamic route

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/produits/${id}`);
        if (!response.ok) {
          throw new Error("Impossible de charger le produit");
        }
        const data = await response.json();
        setProduit(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]); // Dependency on 'id' instead of 'params.id'

  const handleAddToCart = () => {
    if (!produit) return;

    // Check availability
    if (produit.disponibilite !== 1) {
      alert("Produit non disponible");
      return;
    }

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("lux_paradise_cart") || "[]");

    // Add to cart if not already present
    if (!cart.includes(produit.id.toString())) {
      cart.push(produit.id.toString());
      localStorage.setItem("lux_paradise_cart", JSON.stringify(cart));
      setCartLength(cartLength+1)
      alert("Produit ajouté au panier");
    } else {
      alert("Produit déjà dans le panier");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!produit) return <div>Produit non trouvé</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{produit.nom}</h1>
      </div>

      <div className={styles.productContainer}>
        <div className={styles.left}>
          <div className={styles.imageContainer}>
            <Image
              src={produit.photo}
              width={400}
              height={400}
              alt={produit.nom}
              priority
            />
          </div>
        </div>

        <div className={styles.textContainer}>
          <p>{produit.description}</p>

          <div className={styles.price}>
              <span>{produit.prix} DA</span>
             </div>

          <div className={styles.badges}>
            {produit.nouveaute && (
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
            <div className={styles.disponibleCard}>
              {produit.disponibilite ? <TicketCheck /> : <TicketX />}
              {produit.disponibilite ? <p>Disponible</p> : <p>Non Disponible</p>}
            </div>
          </div>

          <div className={styles.badges}>
            <div className={`${styles.badge} ${styles.qualityBadge}`}>
              <Gem /> Haute Qualité
            </div>
          </div>

          <div className={styles.commander} onClick={handleAddToCart}>
            <h2>COMMANDEZ CE PRODUIT</h2>
            <button>
              <ShoppingBasket /> AJOUTER AU PANIER
            </button>
          </div>
        </div>
      </div>

      


      <div className={styles.infos} >
        <h2>PLUS D'INFORMATIONS SUR CE PRODUIT</h2>
        <p>{produit.infos}</p>
      </div>

      <Suggestion id={id} categorie={produit.categorie_id}/>

    </div>
  );
}