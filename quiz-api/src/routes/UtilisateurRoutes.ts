import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import UtilisateurService from '@src/services/UtilisateurService';
import { IUtilisateur } from '@src/models/Utilisateur';
import { IReq, IRes } from '@src/routes/common/types/index';

// **** Fonctions **** //

/**
 * Récupère la liste de tous les utilisateurs
 */
async function getAll(_: IReq, res: IRes) {
  const utilisateurs = await UtilisateurService.getAll();
  return res.status(HttpStatusCodes.OK).json({ utilisateurs });
}
/**
 * Récupère un utilisateur par ID
 */
async function get(req: IReq<unknown, { id: string }>, res: IRes) {
  const utilisateur = await UtilisateurService.getOne(req.params.id);
  return res.status(HttpStatusCodes.OK).json({ utilisateur });
}
/**
 * Ajoute un nouvel utilisateur à la base de données
 */
async function add(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  let { utilisateur } = req.body;
  utilisateur = await UtilisateurService.addOne(utilisateur);
  return res.status(HttpStatusCodes.CREATED).json({ utilisateur });
}
/**
 * Met à jour les informations d’un utilisateur existant
 */
async function update(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  let { utilisateur } = req.body;
  utilisateur = await UtilisateurService.updateOne(utilisateur);
  return res.status(HttpStatusCodes.OK).json({ utilisateur });
}
/**
 * Supprime un utilisateur par ID
 */
async function delete_(req: IReq<unknown, { id: string }>, res: IRes) {
  await UtilisateurService.delete(req.params.id); 
  return res.status(HttpStatusCodes.OK).end();
}
/**
 * Vérifie si un nom d'utilisateur est unique
 */
async function verifierNom(req: IReq<{ nom: string }>, res: IRes) {
  const nom = req.body.nom;
  const estUnique = await UtilisateurService.verifierNomUnique(nom);
  return res.json({ unique: estUnique });
}

// **** Export **** //

export default {
  getAll,
  get,
  add,
  update,
  delete: delete_,
  verifierNom
} as const;
