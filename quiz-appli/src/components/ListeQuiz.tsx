import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, Container,
  Paper, FormControl, InputLabel, Select, MenuItem, IconButton, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../api/api';
// Liste des catégories disponibles pour les quiz
const categoriesDisponibles = ['Sport', 'Histoire', 'Géographie', 'Culture générale', 'Mathématiques'];

/**
 * Composant affichant tous les quiz filtrés par catégorie
 * Permet à l'utilisateur connecté de créer, modifier ou supprimer ses propres quiz
 */
export default function ListeQuiz() {
  const [quizzs, setQuizzs] = useState<any[]>([]);
  const [categorie, setCategorie] = useState<string>('Culture générale');
  // Infos de l’utilisateur connecté
  const { nomUtilisateur, token } = useAuth();
  const api = useApi();
  // ID du quiz à supprimer
  const [quizASupprimer, setQuizASupprimer] = useState<string | null>(null);
  /**
     * Récupère les quiz selon la catégorie sélectionnée à chaque changement
     */
  useEffect(() => {
    api.get(`/quizzs/categorie/${encodeURIComponent(categorie)}`)
      .then((res) => setQuizzs(res.data.quizzs))
      .catch(console.error);
  }, [categorie]);

  /**
   * Supprime un quiz sélectionné s’il existe et met à jour l’interface
   */
  const supprimerQuiz = async () => {
    if (!quizASupprimer) return;
    try {
      await api.delete(`/quizzs/delete/${quizASupprimer}`);
      setQuizzs(quizzs.filter((q) => q._id !== quizASupprimer));
      setQuizASupprimer(null);
    } catch (err) {
      console.error('Erreur suppression quiz:', err);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to right, #e0f7fa, #fff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'auto',
        p: 3,
      }}
    >
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            Liste des quiz
          </Typography>
          {/* Bouton visible uniquement pour les utilisateurs connectés */}
          {token && (
            <Box textAlign="center" mb={3}>
              <Button
                variant="outlined"
                component={Link}
                to="/ajouter-quiz"
              >
                Créer un quiz
              </Button>
            </Box>
          )}
          {/* Sélection de la catégorie */}
          <FormControl fullWidth sx={{ my: 3 }}>
            <InputLabel id="categorie-label">Catégorie</InputLabel>
            <Select
              labelId="categorie-label"
              value={categorie}
              label="Catégorie"
              onChange={(e) => setCategorie(e.target.value)}
            >
              {categoriesDisponibles.map((cat, idx) => (
                <MenuItem key={idx} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Grille contenant les cartes de quiz */}
          <Grid container columns={12} spacing={3} justifyContent="center">
            {quizzs.map((quiz) => {
              const estCreateur = quiz.createur?.nomUtilisateur === nomUtilisateur;

              return (
                <Grid key={quiz._id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ borderRadius: 3, boxShadow: 4, height: '100%' }}>
                    <CardContent>
                      {/* Titre du quiz */}
                      <Typography variant="h6" gutterBottom>{quiz.titre}</Typography>
                      {/* Nom du créateur */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Créé par : {quiz.createur?.nomUtilisateur || 'Inconnu'}
                      </Typography>
                      {/* Bouton pour démarrer le quiz */}
                      <Button
                        component={Link}
                        to={`/quiz/${quiz._id}`}
                        variant="contained"
                        fullWidth
                      >
                        Commencer
                      </Button>
                      {/* Boutons modifier/supprimer visibles uniquement pour le créateur */}
                      {token && estCreateur && (
                        <Box display="flex" gap={1} justifyContent="center" mt={1}>
                          <IconButton
                            component={Link}
                            to={`/modifier-quiz/${quiz._id}`}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => setQuizASupprimer(quiz._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Dialogue de confirmation suppression */}
        <Dialog open={!!quizASupprimer} onClose={() => setQuizASupprimer(null)}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>Voulez-vous vraiment supprimer ce quiz ? Cette action est irréversible.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQuizASupprimer(null)}>Annuler</Button>
            <Button onClick={supprimerQuiz} color="error">Supprimer</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
