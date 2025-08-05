import { Router, Request, Response, NextFunction } from 'express';
import { param, validationResult, body } from 'express-validator';

import Paths from '@src/common/constants/Paths';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

import UtilisateurRoutes from './UtilisateurRoutes';
import QuizRoutes from './QuizRoutes';
import ResultatRoutes from './ResultatRoutes';
import JetonRoutes from './JetonRoutes';

import Utilisateur from '@src/models/Utilisateur';
import Quiz from '@src/models/Quiz';
import authenticateToken from '@src/common/util/authenticateToken';

// **** Variables **** //

const apiRouter = Router();

// ** Middleware de validation express-validator ** //

function validateParams(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
}

// ** Validation d’un utilisateur ** //

function validateUtilisateur(req: Request, res: Response, next: NextFunction) {
  if (!req.body?.utilisateur) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send({ error: 'Utilisateur requis' }).end();
  }

  const doc = new Utilisateur(req.body.utilisateur);
  const error = doc.validateSync();
  if (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  }

  next();
}

// ** Validation d’un quiz ** //

function validateQuiz(req: Request, res: Response, next: NextFunction) {
  if (!req.body?.quiz) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send({ error: 'Quiz requis' }).end();
  }

  const doc = new Quiz(req.body.quiz);
  const error = doc.validateSync();
  if (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST).send(error).end();
  }

  next();
}

// **** Router utilisateurs **** //

const userRouter = Router();

userRouter.get(Paths.Utilisateurs.Get, UtilisateurRoutes.getAll);
userRouter.get(
  Paths.Utilisateurs.GetOne,
  param('id').isString().withMessage('ID requis'),
  validateParams,
  UtilisateurRoutes.get
);
userRouter.post(Paths.Utilisateurs.Add, validateUtilisateur, UtilisateurRoutes.add);
userRouter.put(Paths.Utilisateurs.Update, validateUtilisateur, UtilisateurRoutes.update);
userRouter.delete(
  Paths.Utilisateurs.Delete,
  param('id').isString().withMessage('ID requis'),
  validateParams,
  UtilisateurRoutes.delete
);
userRouter.post(Paths.Utilisateurs.VerifierNom, UtilisateurRoutes.verifierNom);

apiRouter.use(Paths.Utilisateurs.Base, userRouter);

// **** Router quizzs **** //

const quizRouter = Router();

quizRouter.get(Paths.Quizzs.Get, QuizRoutes.getAll);
quizRouter.get(
  Paths.Quizzs.GetOne,
  param('id').isString().withMessage('ID requis'),
  validateParams,
  QuizRoutes.get
);
quizRouter.get(
  '/categorie/:categorie',
  param('categorie').isString().withMessage('Catégorie requise'),
  validateParams,
  QuizRoutes.getByCategorie
);
quizRouter.post(Paths.Quizzs.Add, authenticateToken, validateQuiz, QuizRoutes.add);
quizRouter.put(Paths.Quizzs.Update, authenticateToken, validateQuiz, QuizRoutes.update);
quizRouter.delete(
  Paths.Quizzs.Delete,
  authenticateToken,
  param('id').isString().withMessage('ID requis'),
  validateParams,
  QuizRoutes.delete
);

apiRouter.use(Paths.Quizzs.Base, quizRouter);

// **** Router résultats **** //

const resultatRouter = Router();

resultatRouter.post(
  '/add',
  body('resultat.nomUtilisateur')
    .trim()
    .isLength({ min: 2, max: 30 })
    .matches(/^[a-zA-Z0-9À-ÿ\s_-]+$/)
    .withMessage('Nom invalide'),
  validateParams,
  ResultatRoutes.add
);

resultatRouter.get(
  '/quiz/:quizId',
  param('quizId').isString().withMessage('ID de quiz requis'),
  validateParams,
  ResultatRoutes.getClassement
);

apiRouter.use('/resultats', resultatRouter);

// ** Add JetonRouter ** //

// Init Router
const tokenRouter = Router();

// Generate token
tokenRouter.post(Paths.GenerateToken.Get, JetonRoutes.generateToken);

// Add JetonRouter
apiRouter.use(Paths.GenerateToken.Base, tokenRouter);

// **** Export default **** //

export default apiRouter;
