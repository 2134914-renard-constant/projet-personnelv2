import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import QuizService from '@src/services/QuizService';
import { IQuiz } from '@src/models/Quiz';
import { IReq, IRes } from '@src/routes/common/types/index';
import Utilisateur from '@src/models/Utilisateur';

// **** Fonctions **** //

/**
 * Lire tous les quiz.
 */
async function getAll(_: IReq, res: IRes) {
  const quizzs = await QuizService.getAll();
  return res.status(HttpStatusCodes.OK).json({ quizzs });
}

/**
 * Lire un quiz par ID.
 */
async function get(req: IReq<unknown, { id: string }>, res: IRes) {
  const quiz = await QuizService.getOne(req.params.id);
  return res.status(HttpStatusCodes.OK).json({ quiz });
}

/**
 * Ajouter un quiz.
 */
async function add(req: IReq<{ quiz: IQuiz }>, res: IRes) {
  const utilisateurId = (req as any).utilisateur?.id;
  const { quiz } = req.body;

  // Injecte automatiquement le créateur
  quiz.createur = utilisateurId;

  const nouveauQuiz = await QuizService.addOne(quiz);
  return res.status(201).json({ quiz: nouveauQuiz });
}

/**
 * Mettre à jour un quiz.
 */
async function update(req: IReq<{ quiz: IQuiz }>, res: IRes) {
  const utilisateurId = (req as any).utilisateur?.id;

  if (!utilisateurId) {
    return res.sendStatus(HttpStatusCodes.UNAUTHORIZED);
  }

  const { quiz } = req.body;
  const quizModifié = await QuizService.updateOne(quiz, utilisateurId); 

  return res.status(HttpStatusCodes.OK).json({ quiz: quizModifié });
}

/**
 * Supprimer un quiz.
 */
async function delete_(req: IReq<unknown, { id: string }>, res: IRes) {
  const utilisateurId = (req as any).utilisateur?.id;
  await QuizService.delete(req.params.id, utilisateurId);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Lire les quiz par catégorie.
 */
async function getByCategorie(req: IReq<unknown, { categorie: string }>, res: IRes) {
  const categorie = decodeURIComponent(req.params.categorie);
  const quizzs = await QuizService.getQuizzsParCategorie(categorie);
  return res.status(HttpStatusCodes.OK).json({ quizzs });
}



// **** Export **** //

export default {
  getAll,
  get,
  add,
  update,
  delete: delete_,
  getByCategorie
} as const;
