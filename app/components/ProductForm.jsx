"use client";
import { useEffect, useState } from "react";
import styles from "@/app/modules/dashboard.module.css";
import { useRouter } from "next/navigation";

export default function ProductForm({ categories, produit, onSuccess }) {
  const [status, setStatus] = useState({ success: null, error: null, pending: false });
  const isEditing = !!produit; // Vérifie si on est en mode édition
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ success: null, error: null, pending: true });

    try {
      const formData = new FormData(e.target);
      
      // Différentes routes et méthodes selon le mode
      const url = isEditing ? `/api/produits/${produit.id}/edit` : "/api/produits";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ success: true, error: null, pending: false });
        if (onSuccess) onSuccess(result); // Callback pour notifier le parent
        if (!isEditing) e.target.reset(); // Réinitialiser le formulaire uniquement en mode ajout

        router.push("/dashboard/produits") // Rafraîchir la page pour afficher les changements
      } else {
        setStatus({ success: null, error: result.error || "Erreur lors de l'opération", pending: false });
      }
    } catch (error) {
      setStatus({ success: null, error: error.message, pending: false });
    }
  };

  return (
    <div className={styles.productForm}>
      {status.error && <p className={styles.error}>{status.error}</p>}
      {status.success && <p className={styles.success}>
        {isEditing ? "Produit modifié !" : "Produit ajouté !"}
      </p>}

      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="nom" 
          placeholder="Nom du produit" 
          defaultValue={produit?.nom || ""}
          required 
        />
        <input 
          type="text" 
          name="description" 
          placeholder="Courte Description" 
          defaultValue={produit?.description || ""}
          required 
        />

        <input 
          type="text"
          name="infos"
          placeholder="Longue Description"
          defaultValue={produit?.description || ""}
          required
        />

        <input 
          type="number" 
          name="prix" 
          placeholder="Prix du produit (DA)" 
          defaultValue={produit?.prix || ""}
          required 
        />
        <select 
          name="category" 
          defaultValue={produit?.categorie_id || ""}
          required
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nom}
            </option>
          ))}
        </select>
        
      
      {
         !isEditing &&   // Afficher le champ de fichier uniquement pour un nouvel ajout
         <input 
          type="file" 
          name="image" 
          required={!isEditing} // Obligatoire seulement pour un nouvel ajout
        />

      }  
        
        <button type="submit" disabled={status.pending}>
          {status.pending 
            ? (isEditing ? "Modification en cours..." : "Ajout en cours...") 
            : (isEditing ? "Modifier le produit" : "Ajouter le produit")
          }
        </button>
      </form>
    </div>
  );
}