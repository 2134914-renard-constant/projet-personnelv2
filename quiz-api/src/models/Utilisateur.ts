import mongoose, { Schema, model } from 'mongoose';

// Interface TypeScript définissant la structure d’un utilisateur
export interface IUtilisateur {
  nomUtilisateur: string;     
  motDePasse: string;         
  dateInscription?: Date;     
  _id?: string;               
}

// Interface juste pour la connexion
export interface IUserLogin {
  nomUtilisateur: string;
  motDePasse: string;
}

// Définition du schéma Mongoose pour la collection des utilisateurs
const UtilisateurSchema = new Schema<IUtilisateur>({
  nomUtilisateur: {
    type: String,
    required: [true, 'Le nom d’utilisateur est obligatoire'], 
    unique: true,  
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'], 
  },
  dateInscription: {
    type: Date,
    default: Date.now, 
  },
});

// Désactivation de la pluralisation automatique
mongoose.pluralize(null);

export default model<IUtilisateur>('utilisateurs', UtilisateurSchema);
