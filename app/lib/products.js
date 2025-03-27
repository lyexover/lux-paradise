'use server'
import { db } from "./db"


export async function fetchProduits(query, categorie, prix){

    try {
        const connection = await db.getConnection()

        let baseQuery = 'SELECT * FROM produits WHERE 1=1 '

        const queryParams = [] // tableau qui va contenir les valeurs de la query
        
        if(query){
            baseQuery += ' AND nom LIKE ?'
            queryParams.push(`%${query}%`)
        }

        if(categorie){
            baseQuery += ' AND categorie_id = ?'
            queryParams.push(categorie)
        }

        if(prix === 'asc'){
            baseQuery += ' ORDER BY prix ASC'
        }
        else if(prix === 'desc'){
            baseQuery += ' ORDER BY prix DESC'
        }

        const [rows] = await connection.query(baseQuery, queryParams);
    await connection.release();
    
    return rows;


    }
    catch(err){
        console.error('Error fetching products:', err);
        return [];
    }

}