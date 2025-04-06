"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "@/app/modules/produit.module.css";
import { TicketCheck, TicketX, Gem, ShoppingBasket, ShieldCheck, ShieldX, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import Suggestion from "@/components/Suggestions";
import { useCart } from "@/app/context/cartContext";

export default function ProductDetailsPage() {
  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [quantite, setQuantite] = useState(1);
  const [showNavOptions, setShowNavOptions] = useState(false);
  const {cartLength, setCartLength} = useCart();

  const params = useParams();
  const id = params?.id_produit;

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
  }, [id]);

  const decrementQuantite = () => {
    if (quantite > 1) {
      setQuantite(quantite - 1);
    }
  };

  const incrementQuantite = () => {
    setQuantite(quantite + 1);
  };

  const handleAddToCart = () => {
    if (!produit || produit.disponibilite !== 1) return;

    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem("lux_paradise_cart") || "[]");
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => 
      typeof item === 'object' && item.id === produit.id.toString()
    );
    
    if (existingItemIndex === -1) {
      // Add new product with quantity
      cart.push({ id: produit.id.toString(), quantite: quantite });
      localStorage.setItem("lux_paradise_cart", JSON.stringify(cart));
      setCartLength(cartLength + 1);
      setShowMessage(true);
      setShowNavOptions(true);
      
      // Hide success message after a delay
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } else {
      setShowAlert(true);
      
      // Hide alert message after a delay
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!produit) return <div>Produit non trouvé</div>;

  return (
    <>
      {showNavOptions && (
        <div className={styles.navigationOptions}>
          <div className={styles.navContent}>
            <div className={styles.navMessage}>
              <ShieldCheck size={20} /> 
              <p>Produit ajouté au panier avec succès!</p>
            </div>
            <div className={styles.navButtons}>
              <Link href="/boutique" className={styles.continueLink}>
                <ArrowRight size={16} /> Continuer les achats
              </Link>
              <Link href="/panier" className={styles.cartLink}>
                <ShoppingCart size={16} /> Voir le panier
              </Link>
            </div>
          </div>
        </div>
      )}

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
            </div>

            <div className={styles.disponibilite}>
              <p className={styles.disponibTitle}>Disponibilité :</p>
              <div className={produit.disponibilite === 1 ? styles.disponibleCard : styles.indisponibleCard}>
                {produit.disponibilite === 1 ? <TicketCheck /> : <TicketX />}
                {produit.disponibilite === 1 ? <p>Disponible</p> : <p>Non Disponible</p>}
              </div>
            </div>

            <div className={styles.badges}>
              <div className={`${styles.badge} ${styles.qualityBadge}`}>
                <Gem /> Haute Qualité
              </div>
            </div>

            <div className={styles.commander}>
              <h2>COMMANDEZ CE PRODUIT</h2>
              
              <div className={styles.commanderActions}>
                <div className={styles.quantiteContainer}>
                  <p className={styles.quantiteTitle}>Quantité :</p>
                  <div className={styles.quantiteControls}>
                    <button onClick={decrementQuantite} className={styles.quantiteBtn}>
                      <Minus size={16} />
                    </button>
                    <span className={styles.quantiteValue}>{quantite}</span>
                    <button onClick={incrementQuantite} className={styles.quantiteBtn}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={handleAddToCart} 
                  disabled={produit.disponibilite !== 1}
                  className={produit.disponibilite !== 1 ? styles.disabledButton : styles.addToCartBtn}
                >
                  <ShoppingBasket /> AJOUTER AU PANIER
                </button>
              </div>
              
              {
                showMessage && (
                  <div className={styles.message}>
                    <ShieldCheck /> <p>Produit ajouté au panier !</p>
                  </div>
                )
              }  
              {
                showAlert && (
                  <div className={styles.alert}>
                    <ShieldX /> <p>Produit déjà dans le panier !</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>

        <div className={styles.infos}>
          <h2>PLUS D'INFORMATIONS SUR CE PRODUIT</h2>
          <p>{produit.infos}</p>
        </div>

        <Suggestion id={id} categorie={produit.categorie_id}/>
      </div>
    </>
  );
}