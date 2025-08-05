import type { IQuestion } from './iQuestion';

export interface IQuiz {
  _id?: string;
  titre: string;
  categorie: string;
  questions: IQuestion[];
  createur: string;
  dateCreation?: Date;
}
