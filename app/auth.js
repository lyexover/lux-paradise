import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import {db} from "@/lib/db.js";



async function getPassword() {
  try {
    const [results] = await db.query('SELECT password FROM admin LIMIT 1');
    if (!results || results.length === 0) {
      throw new Error('Aucun mot de passe admin trouvé');
    }
    return results[0].password;
  } catch (error) {
    console.error('Erreur lors de la récupération du mot de passe :', error);
    return null;
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      
      async authorize(credentials) {
        // Récupère le mot de passe
        const password = credentials?.password;
        

        // Vérifie si le mot de passe est fourni
        if (!password) {
          return null;
        }

        // Récupère le mot de passe haché
        const storedPassword = await getPassword();
        if (!storedPassword) {
          return null;
        }

        // Vérifie la correspondance
        const passwordMatch = await bcrypt.compare(password, storedPassword);
        if (!passwordMatch) {
          console.log('Mot de passe incorrect');
          return null;
        }

        console.log('Connexion réussie');
        return { id: 'admin', name: 'Admin' };
      },
    }),
  ],
});