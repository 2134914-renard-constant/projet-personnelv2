import mongoose from 'mongoose';
import ENV from '@src/common/constants/ENV';
import logger from 'jet-logger';

/**
 * Établit une connexion à la base de données MongoDB avec Mongoose
 * 
 * Auteur : Constant Renard
 * 
 * @returns {Promise<void>} Ne retourne rien si la connexion réussit. En cas d’échec le processus est terminé avec `process.exit(1)`.
 * 
 * Comporte une validation de l’URI (ENV.MongoUri) et affiche des messages de log clairs.
 */
export const connecterBD = async (): Promise<void> => {
  try {
    
    await mongoose.connect(ENV.MongoUri);

    logger.info(() => 'Connexion MongoDB réussie');
  } catch (err) {
    console.error('Erreur MongoDB : ', (err as Error).message);

    // Termine le processus avec un code d'erreur (1 = échec)
    process.exit(1);
  }
};
