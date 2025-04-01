'use client'

import { useEffect, useState } from "react"
import styles from '@/app/modules/dashboard.module.css'

export default function Page(){
    const [commandes, setCommandes] = useState([])
    const [filteredCommandes, setFilteredCommandes] = useState([])
    const etats = ['en attente', 'traitee', 'livree', 'annulee', 'finalisee', 'retournee']; // liste des etats possibles de commandes
    const [loading, setLoading] = useState(true)
    const [etatChoisi, setEtatChoisi] = useState('')   //state pour stocker l'etat du filtre
    
    // States pour la pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10) // Nombre d'éléments par page
    const [totalPages, setTotalPages] = useState(0)

    //fonction pour recuperer les commandes
    useEffect(()=> {
         async function fetchData(){
            try{
                const response = await fetch('http://localhost:3000/api/commandes')

                if(!response.ok){
                    throw new Error()
                }
                const data = await response.json()
                
                setCommandes(data.rows)
                setLoading(false)
            }
            catch(err){
                console.error(err)
            }
         }    
         
         fetchData()
    }, [])

    // Effect pour filtrer les commandes quand etatChoisi change ou quand commandes change
    useEffect(() => {
        const filtered = etatChoisi 
            ? commandes.filter(commande => commande.etat === etatChoisi)
            : commandes;
        
        setFilteredCommandes(filtered);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        setCurrentPage(1); // Retour à la première page quand on change le filtre
    }, [etatChoisi, commandes, itemsPerPage]);

    //fonction pour gerer le changement de l'etat d'une commande
    async function handleEtatChange(newstate, id){
        try {
            const response = await fetch(`http://localhost:3000/api/commandes/${id}` , {
                method : 'PATCH', 
                headers : {
                    'Content-type' : 'application/json'
                }, 
                body : JSON.stringify({nouveau : newstate})
            })

            if(!response.ok){
                throw new Error()
            }

            const data = await response.json()
            window.alert(data.message)
            
            // Mettre à jour l'état de la commande dans le state local
            const updatedCommandes = commandes.map(commande => {
                if (commande.id === id) {
                    return { ...commande, etat: newstate };
                }
                return commande;
            });
            setCommandes(updatedCommandes);
        }
        catch(err){
            console.error(err)
        }
    }

    // Fonction pour changer de page
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    }

    // Obtenir les commandes de la page actuelle
    const getCurrentPageItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCommandes.slice(startIndex, endIndex);
    }

    return (
        loading ? <h3>Loading...</h3> :
        <div className={styles.commandesContainer}>
            <div className={styles.commandesHead}>
                <h1>Gestion des commandes</h1>
                <select onChange={(e => setEtatChoisi(e.target.value))} className={styles.filterSelect} name="etat">
                    <option value="">Filtrer par état de commande</option>
                    {
                        etats.map(etat => (
                            <option key={etat} value={etat}>{etat}</option>
                        ))
                    }
                </select>
            </div>

            <div className={styles.commandesList}>
                <table className={styles.commandesTable}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Nom</th>
                            <th>Wilaya</th>
                            <th>Commune</th>
                            <th>Numero</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            getCurrentPageItems().map(commande => (
                                <tr key={commande.id} className={styles.commandeRow}>
                                    <td>{commande.id}</td>
                                    <td>{commande.nom} {commande.prenom}</td>
                                    <td>{commande.wilaya}</td>
                                    <td>{commande.commune}</td>
                                    <td>{commande.numero_telephone}</td>
                                    <td>{commande.timestamp.split('T')[0]}</td>
                                    <td className={styles.totalColumn}>{commande.total}</td>
                                    <td>
                                        <select 
                                            className={styles.statusSelect} 
                                            name="modifierEtat"
                                            data-status={commande.etat}
                                            onChange={(e) => handleEtatChange(e.target.value, commande.id)}
                                        >
                                            <option value=''>{commande.etat}</option>
                                            {
                                                etats.filter(etat => etat !== commande.etat).map(etat => (
                                                    <option key={etat} value={etat}>{etat}</option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            
<div className={styles.pagination}>
    <button 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className={styles.paginationButton}
    >
        Précédent
    </button>
    
    <div className={styles.pageNumbers}>
        {totalPages <= 7 ? (
            // Si le nombre total de pages est petit, afficher toutes les pages
            [...Array(totalPages)].map((_, index) => (
                <button 
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`${styles.pageNumber} ${currentPage === index + 1 ? styles.activePage : ''}`}
                >
                    {index + 1}
                </button>
            ))
        ) : (
            // Si le nombre de pages est grand, utiliser une pagination avec ellipsis
            <>
                {/* Première page toujours affichée */}
                <button 
                    onClick={() => handlePageChange(1)}
                    className={`${styles.pageNumber} ${currentPage === 1 ? styles.activePage : ''}`}
                >
                    1
                </button>
                
                {/* Ellipsis au début si nécessaire */}
                {currentPage > 3 && (
                    <span className={styles.pageNumber} style={{ border: 'none' }}>...</span>
                )}
                
                {/* Pages autour de la page courante */}
                {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Afficher les pages autour de la page courante
                    if (
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1) && 
                        pageNum > 1 && 
                        pageNum < totalPages
                    ) {
                        return (
                            <button 
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`${styles.pageNumber} ${currentPage === pageNum ? styles.activePage : ''}`}
                            >
                                {pageNum}
                            </button>
                        );
                    }
                    return null;
                })}
                
                {/* Ellipsis à la fin si nécessaire */}
                {currentPage < totalPages - 2 && (
                    <span className={styles.pageNumber} style={{ border: 'none' }}>...</span>
                )}
                
                {/* Dernière page toujours affichée */}
                <button 
                    onClick={() => handlePageChange(totalPages)}
                    className={`${styles.pageNumber} ${currentPage === totalPages ? styles.activePage : ''}`}
                >
                    {totalPages}
                </button>
            </>
        )}
    </div>
    
    <button 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
    >
        Suivant
    </button>
    
    <div className={styles.pageInfo}>
        Page {currentPage} sur {totalPages} | 
        Total: {filteredCommandes.length} commandes
    </div>
</div>
        </div>
    )
}