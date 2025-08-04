import Resultat, { IResultat } from '@src/models/Resultat';

/**
 * Ajouter un résultat.
 */
async function add(resultat: IResultat): Promise<IResultat> {
  const nouveau = new Resultat(resultat);
  await nouveau.save();
  return nouveau;
}

/**
 * Obtenir les résultats d’un quiz.
 */
async function getByQuiz(quizId: string): Promise<IResultat[]> {
  return await Resultat.find({ quiz: quizId }).sort({ score: -1 });
}

// **** Export **** //

export default {
  add,
  getByQuiz,
} as const;
