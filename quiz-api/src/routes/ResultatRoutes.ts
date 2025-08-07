import { IReq, IRes } from '@src/routes/common/types/index';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import ResultatService from '@src/services/ResultatService';
import { IResultat } from '@src/models/Resultat';

/**
 * Ajouter un résultat.
 */
async function add(req: IReq<{ resultat: IResultat }>, res: IRes) {
  const { resultat } = req.body;
  const nouveau = await ResultatService.addOne(resultat);
  return res.status(HttpStatusCodes.CREATED).json({ resultat: nouveau });
}

/**
 * Récupérer le classement d’un quiz.
 */
async function getClassement(req: IReq<unknown, { quizId: string }>, res: IRes) {
  const classement = await ResultatService.getByQuiz(req.params.quizId);
  return res.status(HttpStatusCodes.OK).json({ classement });
}

export default {
  add,
  getClassement,
} as const;
