"use client";
import { useEffect, useState } from "react";
import styles from "@/app/modules/dashboard.module.css";
import { useRouter } from "next/navigation";

export default function ProductForm({ categories, produit, onSuccess }) {
  const [status, setStatus] = useState({ success: null, error: null, pending: false });
  const isEditing = !!produit; // Vérifie si on est en mode édition
  const router = useRouter();
  
  // État pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState(produit?.categorie_id || "");
  
  // État pour suivre si une nouvelle image a été sélectionnée
  const [newImageSelected, setNewImageSelected] = useState(false);
  
  // Vérifier si la catégorie sélectionnée est "Parfums"
  const isParfumCategory = () => {
    const parfumCategory = categories.find(cat => cat.nom.toLowerCase() === "parfums");
    return parfumCategory && parseInt(selectedCategory) === parfumCategory.id;
  };

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
        setNewImageSelected(false); // Réinitialiser l'état de sélection d'image
        if (onSuccess) onSuccess(result); // Callback pour notifier le parent
        if (!isEditing) e.target.reset(); // Réinitialiser le formulaire uniquement en mode ajout

        router.push("/dashboard/produits"); // Rafraîchir la page pour afficher les changements
      } else {
        setStatus({ success: null, error: result.error || "Erreur lors de l'opération", pending: false });
      }
    } catch (error) {
      setStatus({ success: null, error: error.message, pending: false });
    }
  };

  // Mettre à jour la catégorie sélectionnée quand on change de produit ou sélectionne une catégorie
  useEffect(() => {
    if (produit) {
      setSelectedCategory(produit.categorie_id || "");
    }
  }, [produit]);

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImageSelected(true);
    } else {
      setNewImageSelected(false);
    }
  };

  return (
    <div className={styles.productForm}>
      {status.error && <p className={styles.error}>{status.error}</p>}
      {status.success && <p className={styles.success}>
        {isEditing ? "Produit modifié !" : "Produit ajouté !"}
      </p>}

      <h2>{isEditing ? 'Modifier le produit' : 'Ajouter un Produit'}</h2>

      <form onSubmit={handleSubmit}>

        <div className={styles.formContent}>
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
          defaultValue={produit?.infos || ""}
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Choisir une catégorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nom}
            </option>
          ))}
        </select>
        
        {/* Champs conditionnels pour les parfums */}
        {isParfumCategory() && (
          <>
            <select 
              name="sexe" 
              defaultValue={produit?.sexe || ""}
              required={isParfumCategory()}
            >
              <option value="">Sexe</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="unisexe">Unisexe</option>
            </select>
            
            <select 
              name="saison" 
              defaultValue={produit?.saison || ""}
              required={isParfumCategory()}
            >
              <option value="">Saison</option>
              <option value="printemps">Printemps</option>
              <option value="ete">Été</option>
              <option value="automne">Automne</option>
              <option value="hiver">Hiver</option>
            </select>
            
            <select 
              name="intensite" 
              defaultValue={produit?.intensite || ""}
              required={isParfumCategory()}
            >
              <option value="">Intensitè</option>
              <option value="legere">Légère</option>
              <option value="moderee">Modérée</option>
              <option value="intense">Intense</option>
            </select>
            
            <select 
              name="occasion" 
              defaultValue={produit?.occasion || ""}
              required={isParfumCategory()}
            >
              <option value="">Occasion</option>
              <option value="quotidien">Quotidien</option>
              <option value="travail">Travail</option>
              <option value="soiree">Soirée</option>
              <option value="evenement special">Événement spécial</option>
            </select>
          </>
        )}
      
        {/* Champ d'image modifié pour supporter la mise à jour */}
        <div>
          {isEditing && produit.photo && !newImageSelected && (
            <div className={styles.currentImage}>
              <p>Image actuelle: </p>
              <img 
                src={produit.photo} 
                alt={produit.nom}
                style={{ maxWidth: "100px", maxHeight: "100px" }}
              />
            </div>
          )}
          
          <input 
            type="file" 
            name="image" 
            onChange={handleImageChange}
            required={!isEditing} // Obligatoire seulement pour un nouvel ajout
          />
          
          {isEditing && (
            <input 
              type="hidden" 
              name="currentPhoto" 
              value={produit?.photo || ""} 
            />
          )}
        </div>

        </div>
        
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