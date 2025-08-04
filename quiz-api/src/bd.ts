import mongoose from 'mongoose';
import ENV from '@src/common/constants/ENV';
import logger from 'jet-logger';

// Fonction qui établit une connexion à la base de données MongoDB
//Auteur : Constant Renard
export const connecterBD = async (): Promise<void> => {
  try {
    // Vérifie si l'URI de connexion est bien définie
    if (!ENV.MongoUri) throw new Error("MONGO_URI est vide ou non définie");

    await mongoose.connect(ENV.MongoUri);

    logger.info(() => 'Connexion MongoDB réussie');
  } catch (err) {
    console.error('Erreur MongoDB : ', (err as Error).message);

    // Termine le processus avec un code d'erreur (1 = échec)
    process.exit(1);
  }
};
