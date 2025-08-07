import { Schema } from 'mongoose'; 

// Déclaration des niveaux de difficulté possibles pour une question
// "as const" permet de créer un tableau immuable
export const niveaux = ['facile', 'moyen', 'difficile'] as const;

export interface IQuestion {
  enonce: string; 
  options: string[];
  bonneReponseIndex: number; 
  niveau: typeof niveaux[number]; 
}

// Sert à valider les données et à interagir avec MongoDB
const QuestionSchema = new Schema<IQuestion>({
  enonce: {
    type: String,
    required: [true, 'L’énoncé de la question est obligatoire'],
  },
  options: {
    type: [String], // Tableau de chaînes de caractères
    required: [true, 'Les options sont obligatoires'],
    validate: {
      // Fonction de validation personnalisée : au moins 2 options
      validator: function (v: string[]) {
        return v.length >= 2;
      },
      message: () => 'Il faut au moins deux options de réponse',
    },
  },
  bonneReponseIndex: {
    type: Number,
    required: [true, 'L’indice de la bonne réponse est obligatoire'],
    min: [0, 'L’indice doit être un nombre positif'], 
  },
  niveau: {
    type: String,
    required: [true, 'Le niveau est obligatoire'],
    enum: {
      values: niveaux, 
      message: 'Le niveau doit être facile, moyen ou difficile',
    },
  },
}, { _id: false }); // schéma utilisé en tant que sous-document sans identifiant propre

export default QuestionSchema;
