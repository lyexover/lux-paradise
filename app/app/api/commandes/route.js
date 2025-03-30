import { db } from "@/lib/db";

export async function POST(req) {
  // On va obtenir une connexion depuis le pool
  let connection;
  
  try {
    // Récupérer les données du corps de la requête
    const { data, produits } = await req.json();

    const { nom, prenom, wilaya, commune, numero, email, totalAPayer } = data;

    // Vérification des données
    if (!nom || !prenom || !wilaya || !commune || !numero || !totalAPayer || !produits || produits.length === 0) {
      return new Response(JSON.stringify({ error: "Données manquantes" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Obtenir une connexion du pool
    connection = await db.getConnection();
    
    // Démarrer une transaction sur cette connexion spécifique
    await connection.beginTransaction();

    // 1. Insérer la commande dans la table `commandes`
    const [commandeResult] = await connection.execute(
      `INSERT INTO commandes (nom, prenom, wilaya, commune, numero_telephone, email, total)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nom, prenom, wilaya, commune, numero, email || null, totalAPayer]
    );
    const commandeId = commandeResult.insertId;

    // 2. Insérer les produits dans `produits_commandes`
    const produitValues = produits.map((produit) => [
      commandeId,
      produit.id,
      produit.quantite,
    ]);

    await connection.query(
      `INSERT INTO produits_commandes (commande_id, produit_id, quantite)
       VALUES ?`,
      [produitValues]
    );

    // Valider la transaction
    await connection.commit();
    
    // Réponse réussie
    return new Response(JSON.stringify({ message: "Commande enregistrée avec succès", commandeId }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // En cas d'erreur, annuler la transaction si une connexion a été établie
    if (connection) {
      await connection.rollback();
    }
    
    console.error("Erreur lors de l'enregistrement de la commande :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    // Toujours libérer la connexion pour la renvoyer au pool
    if (connection) {
      connection.release();
    }
  }
}