import { db } from "./db"

export async function fetchProduits(query, categorie, prix, page = 1, productsPerPage = 3) {
    try {
        const connection = await db.getConnection()

        let baseQuery = 'SELECT * FROM produits WHERE 1=1 '

        const queryParams = []
        
        if(query){
            baseQuery += ' AND nom LIKE ?'
            queryParams.push(`%${query}%`)
        }

        if(categorie){
            baseQuery += ' AND categorie_id = ?'
            queryParams.push(categorie)
        }

        baseQuery += ' ORDER BY timestamp DESC'

        if(prix === 'asc'){
            baseQuery += ', prix ASC'
        }
        else if(prix === 'desc'){
            baseQuery += ', prix DESC'
        }

        const offset = (page - 1) * productsPerPage
        baseQuery += ' LIMIT ? OFFSET ?'
        queryParams.push(productsPerPage, offset)

        const [rows] = await connection.query(baseQuery, queryParams);
        await connection.release();
    
        return rows;
    }
    catch(err){
        console.error('Error fetching products:', err);
        return [];
    }
}

export async function countProduits(query, categorie) {
    try {
        const connection = await db.getConnection()

        let baseQuery = 'SELECT COUNT(*) as total FROM produits WHERE 1=1 '

        const queryParams = []
        
        if(query){
            baseQuery += ' AND nom LIKE ?'
            queryParams.push(`%${query}%`)
        }

        if(categorie){
            baseQuery += ' AND categorie_id = ?'
            queryParams.push(categorie)
        }

        const [rows] = await connection.query(baseQuery, queryParams);
        await connection.release();
    
        return rows[0].total;
    }
    catch(err){
        console.error('Error counting products:', err);
        return 0;
    }
}