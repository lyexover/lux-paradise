"use client";
import { useEffect, useState } from "react";
import styles from "@/app/modules/dashboard.module.css";

export default function ProductForm() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState({ success: null, error: null, pending: false });

  // Fetch des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Erreur lors du fetch");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, error: null, pending: true });

    try {
      const formData = new FormData(e.target);
      const response = await fetch("/api/produits", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ success: true, error: null, pending: false });
        e.target.reset(); // Réinitialiser le formulaire
      } else {
        setStatus({ success: null, error: result.error || "Erreur lors de l’ajout", pending: false });
      }
    } catch (error) {
      setStatus({ success: null, error: error.message, pending: false });
    }
  };

  return (
    <div className={styles.formContainer}>
      {status.error && <p className={styles.error}>{status.error}</p>}
      {status.success && <p className={styles.success}>Produit ajouté !</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="nom" placeholder="Nom du produit" required />
        <input type="text" name="description" placeholder="Description" required />
        <input type="number" name="prix" placeholder="Prix du produit (DA)" required />
        <select name="category" required>
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nom}
            </option>
          ))}
        </select>
        <input type="file" name="image" required />
        <button type="submit" disabled={status.pending}>
          {status.pending ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
}