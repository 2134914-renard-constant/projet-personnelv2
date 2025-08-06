import JetonService from '@src/services/JetonService';
import { IReq, IRes } from './common/types';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IUserLogin } from '@src/models/Utilisateur';

/**
 * Contrôleur pour la génération d’un jeton JWT lors de la connexion
 * 
 * @param {IReq} req - La requête contenant l'objet `userlogin` avec le nom d'utilisateur et le mot de passe
 * @param {IRes} res - L’objet de réponse utilisé pour retourner soit un jeton ou soit une erreur HTTP
 * @returns {Promise<IRes>} - Une réponse HTTP avec un jeton JWT (200), ou une erreur 400/401 selon le cas
 * 
 * Inspiré de : https://web3.profinfo.ca/express_jwt/
 * 
 */
async function generateToken(req: IReq, res: IRes) {
  const userlogin = req.body.userlogin as IUserLogin;

  // Vérification des champs obligatoires
  if (!userlogin?.nomUtilisateur || !userlogin?.motDePasse) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      erreur: 'Les champs nomUtilisateur et motDePasse sont requis',
    });
  }

  // Appel du service pour générer le token
  const token = await JetonService.generateToken(userlogin);

  if (!token) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).json({
      erreur: 'Identifiants invalides',
    });
  }

  return res.status(HttpStatusCodes.OK).json({ token });
}

// **** Export **** //
export default {
  generateToken,
} as const;
