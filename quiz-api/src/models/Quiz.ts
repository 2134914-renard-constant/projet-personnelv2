import mongoose, { Schema, Types, model } from 'mongoose';
import QuestionSchema, { IQuestion } from './Question';

export interface IQuiz {
  titre: string;                 
  createur: Types.ObjectId;     
  questions: IQuestion[];       
  dateCreation?: Date;  
  categorie: string;       
  _id?: string;               
}

// Définition du schéma Mongoose du quiz
const QuizSchema = new Schema<IQuiz>({
  titre: {
    type: String,
    required: [true, 'Le titre du quiz est obligatoire'], 
  },
  createur: {
    type: Schema.Types.ObjectId,
    required: [true, 'Le créateur du quiz est obligatoire'],
    ref: 'utilisateurs',
  },
  questions: {
    type: [QuestionSchema],
    required: [true, 'Le quiz doit contenir des questions'],
    validate: {
      validator: function (v: IQuestion[]) {
        return v.length > 0;          
      },
      message: () => 'Un quiz doit avoir au moins une question',
    },
  },
  categorie: { 
    type: String, 
    required: [true, 'La catégorie est obligatoire'] 
  },
  dateCreation: {
    type: Date,
    default: Date.now,                
  },
});

// Désactive la pluralisation automatique du nom de collection par Mongoose
mongoose.pluralize(null);

export default model<IQuiz>('quizzs', QuizSchema);
