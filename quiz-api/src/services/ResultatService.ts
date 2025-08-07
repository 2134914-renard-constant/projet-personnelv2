import ResultatRepo from '@src/repos/ResultatRepo';
import { IResultat } from '@src/models/Resultat';

/**
 * Fonction pour ajouter un nouveau résultat à la base de données
 */
function addOne(resultat: IResultat): Promise<IResultat> {
  return ResultatRepo.add(resultat);
}

/**
 * Récupérer tous les résultats associés à un quiz donné via son ID
 */
function getByQuiz(quizId: string): Promise<IResultat[]> {
  return ResultatRepo.getByQuiz(quizId);
}

export default {
  addOne,
  getByQuiz,
} as const;
