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