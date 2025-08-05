import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import UtilisateurService from '@src/services/UtilisateurService';
import { IUtilisateur } from '@src/models/Utilisateur';
import { IReq, IRes } from '@src/routes/common/types/index';

// **** Fonctions **** //

async function getAll(_: IReq, res: IRes) {
  const utilisateurs = await UtilisateurService.getAll();
  return res.status(HttpStatusCodes.OK).json({ utilisateurs });
}

async function get(req: IReq<unknown, { id: string }>, res: IRes) {
  const utilisateur = await UtilisateurService.getOne(req.params.id);
  return res.status(HttpStatusCodes.OK).json({ utilisateur });
}

async function add(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  let { utilisateur } = req.body;
  utilisateur = await UtilisateurService.addOne(utilisateur);
  return res.status(HttpStatusCodes.CREATED).json({ utilisateur });
}

async function update(req: IReq<{ utilisateur: IUtilisateur }>, res: IRes) {
  let { utilisateur } = req.body;
  utilisateur = await UtilisateurService.updateOne(utilisateur);
  return res.status(HttpStatusCodes.OK).json({ utilisateur });
}

async function delete_(req: IReq<unknown, { id: string }>, res: IRes) {
  await UtilisateurService.delete(req.params.id); 
  return res.status(HttpStatusCodes.OK).end();
}

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
