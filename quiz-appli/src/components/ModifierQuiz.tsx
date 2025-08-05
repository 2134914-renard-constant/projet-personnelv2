import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, TextField, Typography, Button, Container,
  MenuItem, Select, InputLabel, FormControl, FormHelperText
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../api/api';
import { useAuth } from '../contexts/AuthContext';
import type { IQuiz } from '../models/iQuiz';
import type { IQuestion } from '../models/iQuestion';

export default function ModifierQuiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { nomUtilisateur } = useAuth();
  const api = useApi();

  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [message, setMessage] = useState('');
  const [erreurAuth, setErreurAuth] = useState(false);
  const [erreurTitre, setErreurTitre] = useState('');
  const [erreursQuestions, setErreursQuestions] = useState<
    { enonce: string; options: string[]; niveau: string }[]
  >([]);

  useEffect(() => {

    api.get(`/quizzs/${id}`)
      .then((res) => {
        const q = res.data.quiz;
        if (q.createur?.nomUtilisateur !== nomUtilisateur) {
          setErreurAuth(true);
          return;
        }
        setQuiz(q);
        setErreursQuestions(
          q.questions.map(() => ({
            enonce: '',
            options: ['', '', '', ''],
            niveau: '',
          }))
        );
      })
      .catch(() => setMessage('Erreur lors du chargement du quiz'));
  }, [id]);

  const validerQuiz = () => {
    if (!quiz) return false;
    let valide = true;

    setErreurTitre('');
    const nouvellesErreurs = [...erreursQuestions];

    if (!quiz.titre.trim()) {
      setErreurTitre('Le titre est requis.');
      valide = false;
    }

    quiz.questions.forEach((q, idx) => {
      nouvellesErreurs[idx].enonce = '';
      nouvellesErreurs[idx].niveau = '';
      nouvellesErreurs[idx].options = ['', '', '', ''];

      if (!q.enonce.trim()) {
        nouvellesErreurs[idx].enonce = 'L’énoncé est requis.';
        valide = false;
      }

      q.options.forEach((opt, i) => {
        if (!opt.trim()) {
          nouvellesErreurs[idx].options[i] = `L’option ${i + 1} est requise.`;
          valide = false;
        }
      });

      if (!q.niveau) {
        nouvellesErreurs[idx].niveau = 'Le niveau est requis.';
        valide = false;
      }
    });

    setErreursQuestions(nouvellesErreurs);
    return valide;
  };

  const handleChangeQuestion = (index: number, field: keyof IQuestion, value: any) => {
    if (!quiz) return;
    const questionsModifie = [...quiz.questions];
    questionsModifie[index] = { ...questionsModifie[index], [field]: value };
    setQuiz({ ...quiz, questions: questionsModifie });
  };

  const handleChangeTitre = (val: string) => {
    if (!quiz) return;
    setQuiz({ ...quiz, titre: val });
  };

  const handleSave = async () => {
    if (!quiz) return;
    const estValide = validerQuiz();
    if (!estValide) return;

    try {
      await api.put('/quizzs/update', { quiz });
      setMessage('Quiz mis à jour avec succès');
      setTimeout(() => navigate('/quizzs'), 1500);
    } catch {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  if (erreurAuth) {
    return (
      <Box p={4}>
        <Typography color="error" variant="h6" textAlign="center">
          Vous n'avez pas l'autorisation de modifier ce quiz.
        </Typography>
      </Box>
    );
  } else if (!quiz) {
    return (
      <Box p={4}>
        <Typography textAlign="center">Chargement du quiz...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(to right, #e0f7fa, #fff)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto',
      padding: 2,
    }}>
      <Container maxWidth="sm">
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
          <CardContent sx={{ flexGrow: 1, overflowY: 'auto', paddingRight: 2, paddingBottom: 2 }}>
            <Typography variant="h5" gutterBottom>Modifier le quiz</Typography>

            <TextField
              label="Titre du quiz"
              fullWidth
              value={quiz.titre}
              onChange={(e) => handleChangeTitre(e.target.value)}
              error={!!erreurTitre}
              helperText={erreurTitre}
              sx={{ mt: 2 }}
            />

            {quiz.questions.map((q, idx) => (
              <Box key={idx} sx={{ mt: 4 }}>
                <Typography variant="h6">Question {idx + 1}</Typography>

                <TextField
                  label="Énoncé"
                  fullWidth
                  value={q.enonce}
                  onChange={(e) => handleChangeQuestion(idx, 'enonce', e.target.value)}
                  error={!!erreursQuestions[idx]?.enonce}
                  helperText={erreursQuestions[idx]?.enonce}
                  sx={{ mt: 2 }}
                />

                {q.options.map((opt, i) => (
                  <TextField
                    key={i}
                    label={`Option ${i + 1}`}
                    fullWidth
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...q.options];
                      newOptions[i] = e.target.value;
                      handleChangeQuestion(idx, 'options', newOptions);
                    }}
                    error={!!erreursQuestions[idx]?.options[i]}
                    helperText={erreursQuestions[idx]?.options[i]}
                    sx={{ mt: 2 }}
                  />
                ))}

                <FormControl fullWidth error={!!erreursQuestions[idx]?.niveau} sx={{ mt: 2 }}>
                  <InputLabel>Niveau</InputLabel>
                  <Select
                    value={q.niveau}
                    label="Niveau"
                    onChange={(e) => handleChangeQuestion(idx, 'niveau', e.target.value)}
                  >
                    <MenuItem value="facile">Facile</MenuItem>
                    <MenuItem value="moyen">Moyen</MenuItem>
                    <MenuItem value="difficile">Difficile</MenuItem>
                  </Select>
                  {erreursQuestions[idx]?.niveau && (
                    <FormHelperText>{erreursQuestions[idx].niveau}</FormHelperText>
                  )}
                </FormControl>
              </Box>
            ))}

            <Button variant="contained" fullWidth sx={{ mt: 4 }} onClick={handleSave}>
              Enregistrer les modifications
            </Button>

            {message && (
              <Typography textAlign="center" color="primary" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
