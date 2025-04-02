'use client';
import { useState, useEffect } from "react";
import styles from "@/app/modules/commandeForm.module.css";

export default function CommandeForm({ cart, total }) {
  const [formattedCart, setFormattedCart] = useState([]);

  useEffect(() => {
    const transformedCart = cart.map((element) => ({
      id: element,
      quantite: 1,
    }));
    setFormattedCart(transformedCart);
  }, [cart]);

  console.log(formattedCart); // Cela affichera bien la version mise à jour

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    wilaya: '',
    commune: '',
    numero: '',
    email: '',
    totalAPayer: total,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
          produits: formattedCart,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de l’envoi');
      }

      setMessage('Commande envoyée avec succès !');
      setFormData({
        nom: '',
        prenom: '',
        wilaya: '',
        commune: '',
        numero: '',
        email: '',
        totalAPayer: total,
      });

      localStorage.removeItem('lux_paradise_cart');

    } catch (error) {
      setMessage(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Formulaire de Commande</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
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

          <div className={styles.formGroup}>
            <label htmlFor="numero">Numéro de téléphone :</label>
            <input
              type="tel"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="Entrez votre numéro"
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

          <div className={styles.formGroup}>
            <p className={styles.total}>
              Total à payer : {formData.totalAPayer.toLocaleString('fr-FR')} DA
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la commande'}
          </button>
        </form>

        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
}
