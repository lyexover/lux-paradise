"use client";
import { useEffect, useState } from "react";
import styles from "@/app/modules/panier.module.css";
import Image from "next/image";
import { CheckCircle, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/cartContext";

export default function Page() {
  const [produits, setProduits] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const { setCartLength } = useCart();

  // Récupérer les données du panier depuis localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("lux_paradise_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Récupérer les produits et les catégories
  useEffect(() => {
    async function fetchData() {
      if (cart.length === 0) return;

      try {
        const [categorieResponse, produitsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/categories'),
          fetch('http://localhost:3000/api/produits'),
        ]);

        if (!categorieResponse.ok || !produitsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categorieResponse.json();
        const produitsData = await produitsResponse.json();

        setCategories(categoriesData);
        setProduits(
          produitsData.filter((p) =>
            cart.some(
              (item) => item.id === p.id.toString() || item === p.id.toString()
            )
          )
        );
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
  }, [cart]);

  // Trouver la quantité d'un produit
  function findQuantite(id) {
    const cartItem = cart.find((item) =>
      item.id === id.toString() 
    );
    return cartItem.quantite ;
  }

  // Gérer l'incrémentation/décrémentation de la quantité
  function handleQuantityChange(id, change) {
    const updatedCart = cart.map((item) => {
      
      if (item.id === id.toString()) {
        return {
          ...item,
          quantite: Math.max(1, item.quantite + change),
        };
      }
      return item;
    });

    setCart(updatedCart);
    localStorage.setItem("lux_paradise_cart", JSON.stringify(updatedCart));
  }

  const nomCategories = new Map(categories.map((c) => [c.id, c.nom]));

  // Calculer le total du panier
  const totalPanier = produits.reduce((total, produit) => {
    const quantite = findQuantite(produit.id);
    return total + parseFloat(produit.prix) * quantite;
  }, 0);

  // Retirer un produit du panier
  const retirerDuPanier = (id) => {
    const nouveauPanier = cart.filter((item) =>
      item.id !== id.toString() 
    );
    setCart(nouveauPanier);
    localStorage.setItem("lux_paradise_cart", JSON.stringify(nouveauPanier));
    setProduits(prevProduits => prevProduits.filter(p => p.id.toString() !== id.toString()));
    setCartLength(nouveauPanier.length);
  };

  // Rediriger vers la page du formulaire de commande avec le total en paramètre
  const allerAuFormulaire = () => {
    router.push(`/commande?total=${totalPanier}`);
  };

  return (
    <div className={styles.container}>
      <h1>Votre Panier</h1>

      {produits.length === 0 ? (
        <div className={styles.emptyCart}>
          <ShoppingCart size={50} />
          <p>Votre panier est vide</p>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {produits.map((p) => (
              <div key={p.id} className={styles.cartItem}>
                <div className={styles.imageContainer}>
                  <Image
                    src={p.photo}
                    alt={p.nom}
                    width={150}
                    height={150}
                    objectFit="contain"
                  />
                </div>
                <div className={styles.productInfo}>
                  <h2>{p.nom}</h2>
                  <div className={styles.category}>
                    <span className={styles.categoryLabel}>Catégorie:</span>
                    <span className={styles.categoryName}>
                      {nomCategories.get(p.categorie_id)}
                    </span>
                  </div>
                  <p className={styles.description}>{p.description}</p>
                  <div className={styles.disponibilite}>
                    <div className={styles.disponibleCard}>
                      <CheckCircle size={16} />
                      <span>En stock</span>
                    </div>
                  </div>
                </div>
                <div className={styles.productActions}>
                  <div className={styles.price}>
                    {(parseFloat(p.prix) * findQuantite(p.id)).toLocaleString('fr-FR')} DA
                  </div>
                  <div className={styles.quantiteControls}>
                    <button onClick={() => handleQuantityChange(p.id, -1)}>
                      <Minus size={16} />
                    </button>
                    <p>{findQuantite(p.id)}</p>
                    <button onClick={() => handleQuantityChange(p.id, 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    className={styles.removeButton}
                    onClick={() => retirerDuPanier(p.id)}
                  >
                    <X size={16} />
                    <span>Retirer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span>Total</span>
              <span className={styles.totalPrice}>
                {totalPanier.toLocaleString('fr-FR')} DA
              </span>
            </div>
            <button
              onClick={allerAuFormulaire}
              className={styles.checkoutButton}
            >
              Lancer ma Commande
            </button>
          </div>
        </>
      )}
    </div>
  );
}