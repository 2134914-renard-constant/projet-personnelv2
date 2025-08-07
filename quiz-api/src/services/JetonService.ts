import { IUserLogin } from '@src/models/Utilisateur';
import UtilisateurService from './UtilisateurService';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const UTILISATEUR_NOT_FOUND_ERR = 'Utilisateur non trouvé';

/**
 * Génère un jeton JWT pour un utilisateur si ses identifiants sont valides.
 * 
 * @param {IUserLogin} utilisateur - Les identifiants saisis par l'utilisateur (nom et mot de passe).
 * @returns {Promise<string>} Le jeton signé si l'utilisateur est authentifié sinon une chaîne vide.
 * 
 * Inspiré de : https://web3.profinfo.ca/express_jwt/
 */
async function generateToken(utilisateur: IUserLogin): Promise<string> {
  const utilisateurs = await UtilisateurService.getAll();

  // Recherche l'utilisateur qui a le même nom d'utilisateur que celui fourni en entrée
  const utilisateurBD = utilisateurs.find(
    (user) => user.nomUtilisateur === utilisateur.nomUtilisateur
  );

  // Si un utilisateur est trouvé et que le mot de passe correspond après comparaison avec bcrypt
  if (
    utilisateurBD &&
    (await bcrypt.compare(utilisateur.motDePasse, utilisateurBD.motDePasse))
  ) {
    // Génère un token JWT contenant l'ID et le nom d'utilisateur, valide pour 2 heures
    return jwt.sign(
      {
        id: utilisateurBD._id?.toString(),
        nomUtilisateur: utilisateurBD.nomUtilisateur,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' } 
    );
  }

  return '';
}

export default {
  generateToken,
} as const;
