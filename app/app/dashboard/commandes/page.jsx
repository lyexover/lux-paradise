'use client'

import { useEffect, useState } from "react"
import styles from '@/app/modules/dashboard.module.css'

export default function Page(){
    const [commandes, setCommandes] = useState([])
    const etats = ['en attente', 'traitee', 'livree', 'annulee', 'finalisee', 'retournee']; // liste des etats possibles de commandes
    const [loading, setLoading] = useState(true)

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
    }, [] )

    return (

        
         loading ? <h3>Loading...</h3> :
        <div className={styles.commandesContainer}>
            <div className={styles.commandesHead}>
                <h1>Gestion des commandes</h1>
                <select className={styles.filterSelect} name="etat">
                    <option value="">Filtrer par état de commande</option>
                    {
                        etats.map(etat=> (
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
                            commandes.map(commande => (
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
        </div>
                    
    )
}