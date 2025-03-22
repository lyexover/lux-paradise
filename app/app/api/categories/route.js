import { db } from "@/lib/db";
import { NextResponse } from "next/server";



export async function GET(){
    try {
        const [rows] = await db.query('SELECT * FROM categories')
        return NextResponse.json(rows)
    }
    catch(err){
        return NextResponse.error(err)       // on utilise nextresponse pour retourner une vraie reponse http, a utiliser dans les api.
    }
}


