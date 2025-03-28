import { db } from "@/lib/db";
import { NextResponse } from "next/server";




export async function DELETE(req, {params}){
const {id} = await params; 

if(!id) return NextResponse.json({success: false, error: "Missing id"}, {status: 400});

try {
    const query = "DELETE FROM produits WHERE id = ?";
    await db.query(query, [id]);

    
    return NextResponse.json({success: true});
}

catch(err){
    console.error("Erreur lors de la suppression du produit:", err);
    return NextResponse.json({success: false, error: err.message}, {status: 500});
}

}



export async function PUT(req, {params}){

const {disponibilite} = await req.json()
const {id} = await params; 

if(!id) return NextResponse.json({success: false, error: "Missing id"}, {status: 400});

try {
    const query = "UPDATE produits SET disponibilite = ? WHERE id = ?";
    await db.query(query, [disponibilite, id]);

    return NextResponse.json({success: true});
}
catch(err){
    console.error("Erreur lors de la modification de la disponibilité du produit:", err);
    return NextResponse.json({success: false, error: err.message}, {status: 500});
}

}




export async function GET(request, { params }) {
    try {
      const { id } = await params;
      const query = 'SELECT * FROM produits WHERE id = ?';
      const result = await db.query(query, [id]);
  
      if (result[0].length === 0) {
        return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 });
      }
  
      const produit = result[0][0];
  
      // Calculate nouveaute
      const date = new Date();
      const dateCreation = new Date(produit.timestamp);
      const nouveaute = date.getFullYear() === dateCreation.getFullYear() && 
                        date.getMonth() === dateCreation.getMonth();
  
      return NextResponse.json({
        ...produit,
        nouveaute
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
    }
  }