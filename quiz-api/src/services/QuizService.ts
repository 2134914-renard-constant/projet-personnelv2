import QuizRepo from '@src/repos/QuizRepo';
import { IQuiz } from '@src/models/Quiz';
import { RouteError } from '@src/common/util/route-errors';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
// **** Constantes **** //

export const QUIZ_NON_TROUVÉ = 'Quiz non trouvé';

// **** Fonctions **** //

/**
 * Lire tous les quiz.
 */
function getAll(): Promise<IQuiz[]> {
  return QuizRepo.getAll();
}

/**
 * Ajouter un quiz.
 */
async function addOne(quiz: IQuiz): Promise<IQuiz> {
  return QuizRepo.add(quiz);
}



/**
 * Mise à jour d’un quiz.
 */
async function updateOne(quiz: IQuiz, utilisateurId: string): Promise<IQuiz> {
  const quizExistant = await QuizRepo.getOne(quiz._id!);
  if (!quizExistant) throw new RouteError(HttpStatusCodes.NOT_FOUND, 'Quiz introuvable');
  // Cas où le champ a été rempli (createur est un objet avec _id)
  // Généré par OpenAI. (2025). ChatGPT (version 04 août 2025) [Modèle massif de langage]. https://chat.openai.com/chat
  if (
    typeof quizExistant.createur === 'object' &&
    quizExistant.createur !== null &&
    '_id' in quizExistant.createur
  ) {
    const idC = (quizExistant.createur as { _id: any })._id.toString();
    console.log('ID comparé (populate) =', idC);
    if (idC !== utilisateurId) {
      throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Accès refusé');
    }
  } else {
    const idC = (quizExistant.createur as any).toString();
    console.log('ID comparé (non populate) =', idC);
    if (idC !== utilisateurId) {
      throw new RouteError(HttpStatusCodes.FORBIDDEN, 'Accès refusé');
    }
  }
  // Fin du code généré

  return QuizRepo.update(quiz);
}


/**
 * Supprimer un quiz par ID.
 */
async function _delete(id: string, utilisateurId: string): Promise<void> {
  // Vérifie si le quiz existe
  const quiz = await QuizRepo.getOne(id);
  if (!quiz) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, QUIZ_NON_TROUVÉ);
  }

  return QuizRepo.delete(id);
}

/**
 * Obtenir un quiz par ID.
 */
async function getOne(id: string): Promise<IQuiz> {
  const quiz = await QuizRepo.getOne(id);
  if (!quiz) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, QUIZ_NON_TROUVÉ);
  }
  return quiz;
}

/**
 * Lire les quiz par catégorie.
 */
function getQuizzsParCategorie(categorie: string) {
  if (!categorie) throw new Error('Catégorie invalide');
  return QuizRepo.getByCategorie(categorie);
}

// **** Export **** //

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
  getQuizzsParCategorie
} as const;
