"use client";
import { useEffect, useState } from "react";
import styles from "@/app/modules/panier.module.css";
import Image from "next/image";
import { CheckCircle, Minus, Plus, ShoppingCart, X } from "lucide-react";

export default function Page() {
  const [produits, setProduits] = useState([]);
  // Modified cart structure to store objects with id and quantity instead of just ids
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);

  //recuperer la data de panier depuis le localStorage
  useEffect(() => {
    // S'assurer que `localStorage` est accessible
    const storedCart = localStorage.getItem("lux_paradise_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  //recuperer les produits et les categories
  useEffect(() => {
    async function fetchData() {
      if (cart.length === 0) return; // Évite un appel inutile à l'API

      try {
        const [categorieResponse, produitsResponse] = await Promise.all([
          fetch('http://localhost:3000/api/categories'),
          fetch('http://localhost:3000/api/produits')
        ]);

        if (!categorieResponse.ok || !produitsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categorieResponse.json();
        const produitsData = await produitsResponse.json();

        setCategories(categoriesData);
        // Filter products based on cart items
        setProduits(produitsData.filter((p) => 
          cart.some(item => item.id === p.id.toString() || item === p.id.toString())
        ));
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    fetchData();
  }, [cart]);

  // utilisee pour afficher la quantite de chaque produit 
  function findQuantite(id) {
    // Check if cart contains objects or just ids
    const cartItem = cart.find(item => 
      typeof item === 'object' ? item.id === id.toString() : item === id.toString()
    );
    
    // If item is an object with quantity, return it, otherwise return 1
    return cartItem && typeof cartItem === 'object' ? cartItem.quantite : 1;
  }

  // Refactored function to handle both increment and decrement
  function handleQuantityChange(id, change) {
    const updatedCart = cart.map(item => {
      // If item is a string (old format), convert to object
      const currentItem = typeof item === 'object' ? item : { id: item, quantite: 1 };
      
      if (currentItem.id === id.toString()) {
        return {
          ...currentItem,
          quantite: Math.max(1, currentItem.quantite + change)
        };
      }
      return currentItem;
    });

    setCart(updatedCart);
    localStorage.setItem("lux_paradise_cart", JSON.stringify(updatedCart));
  }

  const nomCategories = new Map(categories.map(c => ([c.id, c.nom])));
  
  // Update total calculation to include quantity
  const totalPanier = produits.reduce((total, produit) => {
    const quantite = findQuantite(produit.id);
    return total + (parseFloat(produit.prix) * quantite);
  }, 0);

  const retirerDuPanier = (id) => {
    const nouveauPanier = cart.filter(item => 
      typeof item === 'object' 
        ? item.id !== id.toString() 
        : item !== id.toString()
    );
    
    setCart(nouveauPanier);
    localStorage.setItem("lux_paradise_cart", JSON.stringify(nouveauPanier));
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
                    <span className={styles.categoryName}>{nomCategories.get(p.categorie_id)}</span>
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
              <span className={styles.totalPrice}>{totalPanier.toLocaleString('fr-FR')} DA</span>
            </div>
            <button className={styles.checkoutButton}>
              Procéder au paiement
            </button>
          </div>
        </>
      )}
    </div>
  );
}