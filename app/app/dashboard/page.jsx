'use client'

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import styles from '@/app/modules/dashboard.module.css';

const DashboardStatistiques = () => {
  const [commandes, setCommandes] = useState([]);
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupération des données depuis les 3 API
        const [commandesRes, produitsRes, categoriesRes] = await Promise.all([
          fetch('/api/commandes'),
          fetch('/api/produits'),
          fetch('/api/categories')
        ]);

        if (!commandesRes.ok || !produitsRes.ok || !categoriesRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const commandesData = await commandesRes.json();
        const produitsData = await produitsRes.json();
        const categoriesData = await categoriesRes.json();

        setCommandes(commandesData.rows || commandesData);
        setProduits(produitsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Préparation des données pour les graphiques
  const prepareCommandesParWilaya = () => {
    const compteur = {};
    commandes.forEach(commande => {
      compteur[commande.wilaya] = (compteur[commande.wilaya] || 0) + 1;
    });
    
    return Object.keys(compteur).map(wilaya => ({
      name: wilaya,
      commandes: compteur[wilaya]
    }));
  };

  if (loading) return <div className={styles.loadingContainer}>Chargement des données...</div>;
  if (error) return <div className={styles.errorMessage}>Erreur: {error}</div>;

  // Si pas de données ou tableaux vides
  if (!commandes.length || !produits.length) {
    return <div className={styles.noData}>Aucune donnée disponible pour l'analyse</div>;
  }

  const commandesParWilaya = prepareCommandesParWilaya();
  
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.dashboardTitle}>Tableau de Bord des Statistiques</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Commandes</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statValue}>{commandes.length}</div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Produits</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statValue}>{produits.length}</div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Total Catégories</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statValue}>{categories.length}</div>
          </div>
        </div>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Valeur Totale</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.statValue}>
              {commandes.reduce((sum, cmd) => sum + cmd.total, 0).toLocaleString()} DA
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.chartsGrid}>
        {/* Graphique des commandes par wilaya */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Commandes par Wilaya</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commandesParWilaya}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="commandes" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Tableau récapitulatif des dernières commandes */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Dernières Commandes</h3>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Wilaya</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.slice(0, 5).map((cmd) => (
                    <tr key={cmd.id}>
                      <td>{cmd.id}</td>
                      <td>{cmd.nom} {cmd.prenom}</td>
                      <td>{cmd.wilaya}</td>
                      <td className={styles.textRight}>{cmd.total.toLocaleString()} DA</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatistiques;