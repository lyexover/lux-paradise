'use client';
import { useEffect, useState } from "react";
import styles from "@/app/modules/commandeForm.module.css";
import { useCart } from "@/app/context/cartContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function CommandePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCartLength } = useCart();
  
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    wilaya: '',
    commune: '',
    numero: '',
    email: '',
    totalAPayer: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Charger les données du panier et le total au chargement de la page
  useEffect(() => {
    // Récupérer le total depuis l'URL
    const total = parseFloat(searchParams.get('total') || 0);
    
    // Récupérer le panier depuis localStorage
    const storedCart = localStorage.getItem("lux_paradise_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
      setFormData(prev => ({
        ...prev,
        totalAPayer: total
      }));
    } else {
      // Rediriger vers le panier si aucun produit n'est présent
      router.push('/panier');
    }
  }, [searchParams, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData,
          produits: cart,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l envoi');
      }
      
      setMessage('Commande envoyée avec succès !');
      
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        prenom: '',
        wilaya: '',
        commune: '',
        numero: '',
        email: '',
        totalAPayer: 0,
      });

      // Vider le panier
      localStorage.removeItem('lux_paradise_cart');
      setCartLength(0);

      // Rediriger vers la page d'accueil après 2 secondes
      setTimeout(() => {
        router.push('/');
      }, 5000);

    } catch (error) {
      setMessage(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const retourAuPanier = () => {
    router.push('/panier');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={retourAuPanier} className={styles.backButton}>
          <ArrowLeft size={16} />
          <span>Retour au panier</span>
        </button>
        <h1 className={styles.title}>Finaliser votre commande</h1>
      </div>

      <div className={styles.formContainer}>
        <h2 className={styles.subtitle}>Informations de livraison</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="nom">Nom :</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                placeholder="Entrez votre nom"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="prenom">Prénom :</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                placeholder="Entrez votre prénom"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="wilaya">Wilaya :</label>
              <input
                type="text"
                id="wilaya"
                name="wilaya"
                value={formData.wilaya}
                onChange={handleChange}
                placeholder="Entrez votre wilaya"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="commune">Commune :</label>
              <input
                type="text"
                id="commune"
                name="commune"
                value={formData.commune}
                onChange={handleChange}
                placeholder="Entrez votre commune"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="numero">Numéro de téléphone :</label>
              <input
                type="tel"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                pattern="^0[0-9]{9}$" 
                placeholder="0x-xx-xx-xx-xx"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrez votre email"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h3>Résumé de la commande</h3>
            <div className={styles.summaryRow}>
              <span>Total à payer :</span>
              <span className={styles.totalPrice}>{formData.totalAPayer.toLocaleString('fr-FR')} DA</span>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={retourAuPanier}
              className={styles.cancelButton}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? 'Envoi en cours...' : 'Confirmer la commande'}
            </button>
          </div>
        </form>

        {message && <div className={styles.message}>{message}</div>}
      </div>
    </div>
  );
}