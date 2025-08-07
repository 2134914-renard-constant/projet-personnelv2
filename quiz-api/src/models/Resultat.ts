import mongoose, { Schema, Types, model } from 'mongoose';

// Interface TypeScript représentant la structure d’un résultat de quiz
export interface IResultat {
    nomUtilisateur: string;            
    quiz: mongoose.Types.ObjectId;     
    score: number;                     
    date: Date;                        
}

// Définition du schéma Mongoose pour un résultat de quiz
const ResultatSchema = new Schema<IResultat>({
    nomUtilisateur: {
        type: String,
        required: true,                
        minlength: 2,                  
        maxlength: 30,                
        validate: {
            // Expression régulière autorisant lettres, chiffres, espaces, accents et tirets
            validator: (val: string) => /^[\w\sÀ-ÿ-]+$/.test(val),
            message: 'Le nom contient des caractères non autorisés.',
        }
    },
    quiz: { 
        type: Schema.Types.ObjectId,  
        ref: 'quizzs',                 
        required: true,                
    },
    score: { 
        type: Number, 
        required: true                
    },
    date: { 
        type: Date, 
        default: Date.now             
    }
});

// Désactive la pluralisation automatique
mongoose.pluralize(null);

export default model<IResultat>('resultats', ResultatSchema);
