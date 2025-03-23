import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function PATCH(req, {params}){
    const {id} = await params;
    const formData = await req.formData();

    const nom = formData.get('nom');
    const description = formData.get('description');
    const prix = formData.get('prix');
    const categorie = formData.get('category');

    try {
        const query = 'UPDATE produits SET nom = ?, description = ?, prix = ?, categorie_id = ? WHERE id = ?';
        await db.query(query, [nom, description, prix, categorie, id]);
        return NextResponse.json({success: true});
    }
    catch(err){
        console.error(err);
        return NextResponse.error(err);
    }
}