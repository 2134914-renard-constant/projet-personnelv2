
export default {
  Base: '/',
  GenerateToken: {
    Base: '/generatetoken',
    Get: '/',
  },
  Utilisateurs: {
    Base: '/users',
    Get: '/all',
    GetOne: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    VerifierNom: '/verifier-nom',
  },

  Quizzs: {
    Base: '/quizzs',
    Get: '/all',
    GetOne: '/:id',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
    GetByCategorie: '/categorie/:categorie',
  },
  Resultats: {
    Base: '/resultats',
    Add: '/add',
    GetClassement: '/quiz/:quizId',
  },
} as const;
