import Quiz, { IQuiz } from '@src/models/Quiz';

/**
 * Obtenir un quiz par ID.
 */
async function getOne(id: string): Promise<IQuiz | null> {
  return await Quiz.findById(id).populate('createur', 'nomUtilisateur');
}

/**
 * Vérifier si un quiz existe.
 */
async function persists(id: string): Promise<boolean> {
  const quiz = await Quiz.findById(id);
  return quiz !== null;
}

/**
 * Obtenir tous les quiz.
 */
async function getAll(): Promise<IQuiz[]> {
  const result = await Quiz.find().populate('createur');
  return result;
}


/**
 * Ajouter un quiz.
 */
async function add(quiz: IQuiz): Promise<IQuiz> {
  const nouveauQuiz = new Quiz(quiz);
  await nouveauQuiz.save();
  return nouveauQuiz;
}

/**
 * Mettre à jour un quiz.
 */
async function update(quiz: IQuiz): Promise<IQuiz> {
  const toUpdate = await Quiz.findById(quiz._id);
  if (!toUpdate) {
    throw new Error('Quiz non trouvé');
  }

  toUpdate.titre = quiz.titre;
  toUpdate.questions = quiz.questions;
  await toUpdate.save();

  return toUpdate;
}

/**
 * Supprimer un quiz.
 */
async function delete_(id: string): Promise<void> {
  await Quiz.findByIdAndDelete(id);
}

/**
 * Obtenir les quiz par catégorie
 */
async function getByCategorie(categorie: string) {
  return Quiz.find({ categorie }).populate('createur', 'nomUtilisateur');
}


// **** Export **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  getByCategorie,
} as const;
