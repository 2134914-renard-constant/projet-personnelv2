import UtilisateurRepo from '@src/repos/UtilisateurRepo';
import { IUtilisateur } from '@src/models/Utilisateur';
import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import bcrypt from 'bcrypt';

export const UTILISATEUR_NON_TROUVÉ = 'Utilisateur non trouvé';


/**
 * Lire tous les utilisateurs.
 */
function getAll(): Promise<IUtilisateur[]> {
  return UtilisateurRepo.getAll();
}

/**
 * Ajouter un utilisateur.
 */
async function addOne(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  // Hachage du mot de passe avant insertion
  utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10);

  return UtilisateurRepo.add(utilisateur);
}

/**
 * Mise à jour d’un utilisateur.
 */
async function updateOne(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  const existe = await UtilisateurRepo.persists(utilisateur._id!);
  if (!existe) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, UTILISATEUR_NON_TROUVÉ);
  }
  return UtilisateurRepo.update(utilisateur);
}

/**
 * Supprimer un utilisateur par ID.
 */
async function _delete(id: string): Promise<void> {
  const existe = await UtilisateurRepo.persists(id);
  if (!existe) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, UTILISATEUR_NON_TROUVÉ);
  }
  return UtilisateurRepo.delete(id);
}

/**
 * Obtenir un utilisateur par ID.
 */
async function getOne(id: string): Promise<IUtilisateur> {
  const utilisateur = await UtilisateurRepo.getOne(id);
  if (!utilisateur) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, UTILISATEUR_NON_TROUVÉ);
  }
  return utilisateur;
}
/**
 * Vérifier unicité du nom de l'utilisateur
 */
async function verifierNomUnique(nom: string): Promise<boolean> {
  return !(await UtilisateurRepo.existeNomUtilisateur(nom));
}

// **** Export **** //

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
  verifierNomUnique
} as const;
