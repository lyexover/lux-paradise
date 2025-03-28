// app/api/produits/route.js
import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs/promises";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid"; // You might need to install this: npm install uuid

export async function POST(req) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});

    // Get the form data using the Request object
    const formData = await req.formData();
    
    // Extract fields
    const nom = formData.get("nom");
    const description = formData.get("description");
    const prix = formData.get("prix");
    const categoryId = formData.get("category");
    const infos = formData.get("infos")
    
    // Handle the file
    const file = formData.get("image");
    let imagePath = null;
    
    if (file) {
      // Get file extension
      const fileExtension = file.name.split('.').pop();
      // Create a unique filename
      const fileName = `${uuidv4()}.${fileExtension}`;
      // Full path to save the file
      const filePath = join(uploadDir, fileName);
      
      // Convert the file to an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Write the file to the filesystem
      await writeFile(filePath, buffer);
      
      // Set the public path to the image
      imagePath = `/uploads/${fileName}`;
    }

    // Insert into database
    const query = "INSERT INTO produits (nom, description, prix, photo, categorie_id, infos) VALUES (?, ?, ?, ?, ?, ?)";
    await db.query(query, [nom, description, prix, imagePath, categoryId, infos]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM produits');
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.error(error);
  }

}


