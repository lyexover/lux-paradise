'use client';

import { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import styles from '@/app/modules/preferenceModal.module.css';
import Link from 'next/link';

const PreferenceModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyOpened, setAlreadyOpened] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parfumCategorieId, setParfumCategorieId] = useState(null);

  // Fetch perfume category ID once when component mounts
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('http://localhost:3000/api/categories');
        const data = await response.json();
        
        const parfumCategory = data.find(cat => cat.nom === 'Parfums');
        if (parfumCategory) {
          setParfumCategorieId(parfumCategory.id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   const stored = localStorage.getItem('isModalOpen');
  //   if (stored) {
  //     setAlreadyOpened(true);
  //   } else {
  //     localStorage.setItem('isModalOpen', 'true');
  //   }
  // }, []);

  const [formData, setFormData] = useState({
    gender: '',
    season: '',
    intensity: '',
    notes: '',
    occasion: '',
    price: ''
  });

  useEffect(() => {
    // Open modal after 2 seconds
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    // Clean up timers
    return () => {
      clearTimeout(openTimer);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/produits');
      const data = await response.json();
      
      console.log('All products:', data);
      console.log('Parfum category ID:', parfumCategorieId);
      console.log('Form data:', formData);

      // Filter products based on form data
      const filteredProducts = data.filter(product => {
        // First check if the product is a perfume based on category
        const isPerfume = parfumCategorieId ? product.categorie_id == parfumCategorieId : true;
        
        // Then apply the form filters
        return (
          isPerfume && 
          (!formData.gender || product.sexe === formData.gender) &&
          (!formData.season || product.saison === formData.season) &&
          (!formData.intensity || product.intensite === formData.intensity) &&
          (!formData.occasion || product.occasion === formData.occasion)
        );
      });
      
      console.log('Filtered products:', filteredProducts);
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Préférences soumises:', formData);
    await fetchProducts();
    setShowResults(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowResults(false);
  };

  const handleBackToForm = () => {
    setShowResults(false);
  };

  if (!isOpen) return null;

  return (
    <div className={alreadyOpened ? styles.hidden : styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {showResults && (
          <button className={styles.backButton} onClick={handleBackToForm}>
            <ArrowLeft size={24} />
          </button>
        )}
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>
        
        <div className={styles.modalContent}>
          {!showResults ? (
            <>
              <h2>Découvrez des parfums adaptés à vos préférences</h2>
              <p>Remplissez ce formulaire pour decouvrir des Parfums selon vos preferences.</p>
              
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Pour qui ?</label>
                  <select 
                    id="gender" 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="unisexe">Unisexe</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="season">Saison préférée</label>
                  <select 
                    id="season" 
                    name="season" 
                    value={formData.season} 
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="printemps">Printemps</option>
                    <option value="ete">Été</option>
                    <option value="automne">Automne</option>
                    <option value="hiver">Hiver</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="intensity">Intensité souhaitée</label>
                  <select 
                    id="intensity" 
                    name="intensity" 
                    value={formData.intensity} 
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="legere">Légère</option>
                    <option value="moderee">Modérée</option>
                    <option value="intense">Intense</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="occasion">Occasion d'utilisation</label>
                  <select 
                    id="occasion" 
                    name="occasion" 
                    value={formData.occasion} 
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="quotidien">Quotidien</option>
                    <option value="travail">Travail</option>
                    <option value="soiree">Soirée</option>
                    <option value="evenement special">Événement spécial</option>
                  </select>
                </div>
                
                <button type="submit" className={styles.submitButton}>
                  Valider mes préférences
                </button>
              </form>
            </>
          ) : (
            <>
              <h2>Parfums recommandés pour vous</h2>
              <p>Basés sur vos préférences personnelles</p>
              
              {loading ? (
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <p>Recherche des parfums parfaits pour vous...</p>
                </div>
              ) : products.length > 0 ? (
                <div className={styles.productsGrid}>
                  {products.map(product => (
                    <Link href={`/boutique/${product.id}`} key={product.id} className={styles.productCard}>
                      <div className={styles.productImageContainer}>
                        {product.photo ? (
                          <img 
                            src={product.photo} 
                            alt={product.nom} 
                            className={styles.productImage}
                          />
                        ) : (
                          <div className={styles.productImage} />
                        )}
                      </div>
                      <div className={styles.productInfo}>
                        <h3>{product.nom}</h3>
                        <div className={styles.productDetails}>
                          {product.sexe && <span className={styles.productTag}>{product.sexe}</span>}
                          {product.saison && <span className={styles.productTag}>{product.saison}</span>}
                          {product.intensite && <span className={styles.productTag}>{product.intensite}</span>}
                        </div>
                        <div className={styles.productPrice}>
                          <span>{product.prix} €</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <p>Aucun parfum ne correspond à vos critères.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;