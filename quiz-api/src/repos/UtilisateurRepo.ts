import Utilisateur, { IUtilisateur } from '@src/models/Utilisateur';

/**
 * Obtenir un utilisateur par ID.
 */
async function getOne(id: string): Promise<IUtilisateur | null> {
  return await Utilisateur.findById(id);
}

/**
 * Vérifier si un utilisateur existe.
 */
async function persists(id: string): Promise<boolean> {
  const utilisateur = await Utilisateur.findById(id);
  return utilisateur !== null;
}

/**
 * Obtenir tous les utilisateurs.
 */
async function getAll(): Promise<IUtilisateur[]> {
  return await Utilisateur.find();
}

/**
 * Ajouter un utilisateur.
 */
async function add(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  const nouvelUtilisateur = new Utilisateur(utilisateur);
  await nouvelUtilisateur.save();
  return nouvelUtilisateur;
}

/**
 * Mettre à jour un utilisateur.
 */
async function update(utilisateur: IUtilisateur): Promise<IUtilisateur> {
  const toUpdate = await Utilisateur.findById(utilisateur._id);
  if (!toUpdate) {
    throw new Error('Utilisateur non trouvé');
  }

  toUpdate.nomUtilisateur = utilisateur.nomUtilisateur;
  toUpdate.motDePasse = utilisateur.motDePasse;
  await toUpdate.save();

  return toUpdate;
}

/**
 * Supprimer un utilisateur.
 */
async function delete_(id: string): Promise<void> {
  await Utilisateur.findByIdAndDelete(id);
}

/**
 * Vérifier nom de l'utilisateur unique
 */
async function existeNomUtilisateur(nom: string): Promise<boolean> {
  const utilisateur = await Utilisateur.findOne({ nomUtilisateur: nom });
  return !!utilisateur;
}

// **** Export **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  existeNomUtilisateur
} as const;
