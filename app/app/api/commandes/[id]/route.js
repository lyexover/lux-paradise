import { db } from "@/lib/db"

export async function PATCH(req, {params}){
    
    const {nouveau} = await req.json()
    const {id} = await params
    const query = `update commandes set etat = ? where id = ?`

    try{
        const [rows] = await db.query(query, [nouveau, id])
        return new Response(JSON.stringify({message :'etat modifie avec succes'}))
    }
    catch(err){
        return new Response(JSON.stringify({message : 'db error'}) , 
        {
            status : 500
        }
          
    )
    }
   
  }