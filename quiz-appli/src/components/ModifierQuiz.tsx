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
  const [unauthorized, setUnauthorized] = useState(false);
  const [erreurs, setErreurs] = useState<any>({});

  useEffect(() => {
    if (!id) return;

    api.get(`/quizzs/${id}`)
      .then((res) => {
        const q = res.data.quiz;
        if (q.createur?.nomUtilisateur !== nomUtilisateur) {
          setUnauthorized(true);
          return;
        }
        setQuiz(q);
      })
      .catch(() => setMessage('Erreur lors du chargement du quiz'));
  }, [id]);

  const validerQuiz = () => {
    const err: any = {};
    if (!quiz?.titre.trim()) err.titre = 'Le titre est requis.';
    quiz?.questions.forEach((q, idx) => {
      if (!q.enonce.trim()) err[`enonce-${idx}`] = 'L’énoncé est requis.';
      q.options.forEach((opt, i) => {
        if (!opt.trim()) err[`option-${idx}-${i}`] = `L’option ${i + 1} est requise.`;
      });
      if (!q.niveau) err[`niveau-${idx}`] = 'Le niveau est requis.';
    });
    return err;
  };

  const handleChangeQuestion = (index: number, field: keyof IQuestion, value: any) => {
    if (!quiz) return;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleChangeTitre = (val: string) => {
    if (!quiz) return;
    setQuiz({ ...quiz, titre: val });
  };

  const handleSave = async () => {
    if (!quiz) return;
    const validationErrors = validerQuiz();
    setErreurs(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await api.put('/quizzs/update', { quiz });
      setMessage('Quiz mis à jour avec succès');
      setTimeout(() => navigate('/quizzs'), 1500);
    } catch {
      setMessage('Erreur lors de la sauvegarde');
    }
  };

  if (unauthorized) {
    return (
      <Box p={4}>
        <Typography color="error" variant="h6" textAlign="center">
          Vous n'avez pas l'autorisation de modifier ce quiz.
        </Typography>
      </Box>
    );
  }

  if (!quiz) {
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
              error={!!erreurs.titre}
              helperText={erreurs.titre}
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
                  error={!!erreurs[`enonce-${idx}`]}
                  helperText={erreurs[`enonce-${idx}`]}
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
                    error={!!erreurs[`option-${idx}-${i}`]}
                    helperText={erreurs[`option-${idx}-${i}`]}
                    sx={{ mt: 2 }}
                  />
                ))}

                <FormControl fullWidth error={!!erreurs[`niveau-${idx}`]} sx={{ mt: 2 }}>
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
                  {erreurs[`niveau-${idx}`] && (
                    <FormHelperText>{erreurs[`niveau-${idx}`]}</FormHelperText>
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
