import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { join } from "path";
import fs from "fs/promises";
import { writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(req, {params}){
    try {
        const { id } = params;
        const formData = await req.formData();

        // Extract fields
        const nom = formData.get('nom');
        const description = formData.get('description');
        const prix = formData.get('prix');
        const categorie = formData.get('category');
        const infos = formData.get('infos');
        const sexe = formData.get('sexe');
        const saison = formData.get('saison');
        const intensite = formData.get('intensite');
        const occasion = formData.get('occasion');
        const currentPhoto = formData.get('currentPhoto');
        
        // Handle image file
        const file = formData.get('image');
        let imagePath = currentPhoto;
        
        // Only process the image if a new one was uploaded
        if (file?.size > 0) {
            // Create uploads directory if it doesn't exist
            const uploadDir = join(process.cwd(), "public/uploads");
            await fs.mkdir(uploadDir, { recursive: true }).catch(() => {});
            
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
            
            // Optionally remove the old image if it exists and is not the default image
            if (currentPhoto && !currentPhoto.includes('default') && currentPhoto.startsWith('/uploads/')) {
                try {
                    const oldImagePath = join(process.cwd(), "public", currentPhoto);
                    await fs.access(oldImagePath); // Check if file exists
                    await fs.unlink(oldImagePath); // Delete the file
                } catch (error) {
                    console.log("Erreur lors de la suppression de l'ancienne image:", error);
                    // Continue anyway, this is not critical
                }
            }
        }

        // Update the product in the database
        const query = `
            UPDATE produits 
            SET nom = ?, description = ?, prix = ?, categorie_id = ?, 
                photo = ?, infos = ?, sexe = ?, saison = ?, intensite = ?, occasion = ? 
            WHERE id = ?
        `;
        
        await db.query(query, [
            nom, description, prix, categorie, 
            imagePath, infos, sexe, saison, intensite, occasion, 
            id
        ]);
        
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Erreur lors de la modification du produit:", err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}