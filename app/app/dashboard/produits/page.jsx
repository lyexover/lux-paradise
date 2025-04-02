'use client'

import { useState, useEffect, useMemo, use } from "react";
import Image from "next/image";
import ProductForm from "@/components/ProductForm";
import styles from "@/app/modules/dashboard.module.css";
import { Pencil } from "lucide-react";


export default function Page() {
    const [showForm, setShowForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [produits, setProduits] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [amodifier, setAmodifier] = useState(null);
    const [loading, setLoading] = useState(true);


    //fonction pour vider le formulaire si on a cliqué sur le bouton modifier un produit avant ajouter 
    function handleAddButton(){
        setAmodifier(null);
        setShowForm(true);
    }


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
                setProduits(produits.reverse());
                setLoading(false);
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

    //data pour la pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const nb_pages = Math.ceil(filteredProducts.length / 16);  // 16 produits par page
    const indiceFin = currentPage * 16;
    const indiceDebut = indiceFin - 16;


   
    // Fonction pour supprimer un produit
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/produits/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Erreur lors de la suppression");
            setProduits((prev) => prev.filter((p) => p.id !== id));

        } catch (err) {
            console.error("Erreur lors de la suppression du produit:", err);
        }
    }

    // Fonction pour mettre à jour la disponibilité d'un produit
    const handleDisponibilite = async (id, etat) => {
        try {
            const response = await fetch(`/api/produits/${id}`, {
                method: "PUT",
                body: JSON.stringify({disponibilite: etat}),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Erreur lors de la mise à jour de la disponibilité");
            setProduits((prev) => prev.map((p) => p.id === id ? {...p, disponibilite: etat} : p));
        }
        catch(err){
            console.error("Erreur lors de la mise à jour de la disponibilité:", err);
        }
    }





    

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
                            produit={amodifier}                      
                        />
                    </div>
                </div>
            )}

            <div className={styles.head}>
                <h1>Gestion des produits</h1>
                <button 
                    className={styles.addButton}
                    onClick={handleAddButton}
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
                {
                loading ? <div>Chargement...</div> :   // si loading est true on affiche "Chargement..."
                
                filteredProducts.length === 0 ? (
                    <div className={styles.noProducts}>
                        Aucun produit ne correspond à votre recherche.
                    </div>
                ) :
                 
                  (
                    filteredProducts.slice(indiceDebut, indiceFin).map((produit) => (
                        <div key={produit.id} className={styles.productCard + (produit.disponibilite === 0 ? ` ${styles.indisponible}` : "")}>
                            <button className={styles.editbtn} onClick={()=> {setShowForm(true); setAmodifier(produit)}} ><Pencil /></button>
                            <div className={styles.productImage}>
                                {produit.photo ? (
                                    <Image 
                                        src={produit.photo} 
                                        alt={produit.nom}
                                        width={300}
                                        height={300}
                                        className={styles.productImg}
                                        
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

                                <button className={styles.dispoBtn}
                                   onClick={() => handleDisponibilite(produit.id ,produit.disponibilite === 1 ? 0 : 1)}
                                >
                                    {produit.disponibilite == 1 ? 'Marquer Indisponible' : 'Marquer Disponible'}
                                </button>

                                <button className={styles.deleteBtn} onClick={()=> handleDelete(produit.id)} >Supprimer</button>
                            </div>
                        </div>
                    ))
                )}
            </div>


            <div className={styles.paginationContainer}>
               {
                Array.from({length: nb_pages}, (_, i)=> {
                    return (
                        <button 
                            key={i}
                            className={currentPage === i + 1 ? styles.active : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                     )}) 
               }
            </div>
        </div>
    );
}