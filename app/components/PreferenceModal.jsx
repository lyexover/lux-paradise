'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from '@/app/modules/preferenceModal.module.css';

const PreferenceModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alreadyOpened, setAlreadyOpened] = useState(false);
  


  useEffect(() => {
    const stored = localStorage.getItem('isModalOpen');
    if (stored) {
      setAlreadyOpened(true);
    } else {
      localStorage.setItem('isModalOpen', 'true');
    }
  }, []);

  

  const [formData, setFormData] = useState({
    gender: '',
    season: '',
    intensity: '',
    notes: '',
    occasion: '',
    price: ''
  });

  useEffect(() => {
    // Ouvrir le modal après 5 secondes
    const openTimer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    // Fermer le modal automatiquement après 5 secondes d'ouverture
    let closeTimer;
    if (isOpen) {
      closeTimer = setTimeout(() => {
        setIsOpen(false);
      }, 10000);
    }

    // Nettoyage des timers
    return () => {
      clearTimeout(openTimer);
      if (closeTimer) clearTimeout(closeTimer);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Préférences soumises:', formData);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className={alreadyOpened ? styles.hidden : styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>
        
        <div className={styles.modalContent}>
          <h2>Découvrez des parfums adaptés à vos préférences</h2>
          <p>Remplissez ce formulaire pour nous aider à mieux comprendre vos préférences.</p>
          
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
                <option value="été">Été</option>
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
                <option value="légère">Légère</option>
                <option value="modérée">Modérée</option>
                <option value="intense">Intense</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="notes">Notes olfactives préférées</label>
              <select 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
              >
                <option value="">Sélectionnez</option>
                <option value="florales">Florales</option>
                <option value="fruitées">Fruitées</option>
                <option value="boisées">Boisées</option>
                <option value="orientales">Orientales</option>
                <option value="fraîches">Fraîches</option>
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
                <option value="soirée">Soirée</option>
                <option value="événement">Événement spécial</option>
              </select>
            </div>
            
            
            
            <button type="submit" className={styles.submitButton}>
              Valider mes préférences
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;