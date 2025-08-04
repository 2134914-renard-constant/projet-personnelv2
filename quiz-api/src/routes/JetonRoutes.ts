import JetonService from '@src/services/JetonService';
import { IReq, IRes } from './common/types';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import { IUserLogin } from '@src/models/Utilisateur';

/**
 * Générer un jeton JWT pour un utilisateur à partir de son nom d'utilisateur et mot de passe
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
