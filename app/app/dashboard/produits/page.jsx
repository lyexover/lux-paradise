'use client'

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import ProductForm from "@/components/ProductForm";
import styles from "@/app/modules/dashboard.module.css";

export default function Page() {
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [produits, setProduits] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    // Récupérer les catégories et produits
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesResponse, produitsResponse] = await Promise.all([
                    fetch("/api/categories"), 
                    fetch("/api/produits")
                ]);

                if (!categoriesResponse.ok || !produitsResponse.ok) 
                    throw new Error("Erreur lors du fetch");

                const [categories, produits] = await Promise.all([
                    categoriesResponse.json(), 
                    produitsResponse.json()
                ]);

                setCategories(categories);
                setProduits(produits);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    // Filtrage des produits
    const filteredProducts = useMemo(() => {
        return produits.filter((product) => {
            if (!search && !category) return true;
            if (search && !category) return product.nom.toLowerCase().includes(search.toLowerCase());
            if (!search && category) return product.categorie_id === parseInt(category);
            return product.nom.toLowerCase().includes(search.toLowerCase()) && product.categorie_id === parseInt(category);
        });
    }, [produits, search, category]);

    return (
        <div className={styles.gestionProduits}>
            {/* Overlay avec formulaire centré et fond flouté */}
            {showForm && (
                <div className={styles.overlay}>
                    <div className={styles.formContainer}>
                        <button 
                            className={styles.closeBtn}
                            onClick={() => setShowForm(false)}
                        >
                            ×
                        </button>
                        <ProductForm 
                            categories={categories}                           
                        />
                    </div>
                </div>
            )}

            <div className={styles.head}>
                <h1>Gestion des produits</h1>
                <button 
                    className={styles.addButton}
                    onClick={() => setShowForm(true)}
                >
                    Ajouter un Produit
                </button>
            </div>

            <div className={styles.filtersContainer}>
                <input 
                    type="text" 
                    placeholder="Cherchez un produit" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select 
                    name="category" 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Toutes les catégories</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.nom}
                        </option>
                    ))}
                </select>
            </div>

            {/* Affichage des produits */}
            <div className={styles.productsContainer}>
                {filteredProducts.length === 0 ? (
                    <div className={styles.noProducts}>
                        Aucun produit ne correspond à votre recherche.
                    </div>
                ) : (
                    filteredProducts.map((produit) => (
                        <div key={produit.id} className={styles.productCard}>
                            <div className={styles.productImage}>
                                {produit.photo ? (
                                    <Image 
                                        src={produit.photo} 
                                        alt={produit.nom}
                                        width={300}
                                        height={300}
                                        className={styles.productImg}
                                        priority={false}
                                    />
                                ) : (
                                    <div className={styles.noImage}>Image non disponible</div>
                                )}
                            </div>
                            <div className={styles.productInfo}>
                                <h3>{produit.nom}</h3>
                                <p className={styles.productPrice}>{produit.prix} DA</p>
                                <p className={styles.productCategory}>
                                    {categories.find(c => c.id === produit.categorie_id)?.nom || "Catégorie inconnue"}
                                </p>
                        
                            </div>
                            <div className={styles.productActions}>
                                <button className={styles.editBtn}>Modifier</button>
                                <button className={styles.deleteBtn}>Supprimer</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}