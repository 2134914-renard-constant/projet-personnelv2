import { useState, useEffect } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button,
  MenuItem, Select, InputLabel, FormControl, Box, FormHelperText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../api/api';
import type { IQuiz } from '../models/iQuiz';
import type { IQuestion } from '../models/iQuestion';

export default function AjouterQuiz() {
  const { token, nomUtilisateur } = useAuth();
  const navigate = useNavigate();
  const api = useApi();

  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState('');
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [indexQuestion, setIndexQuestion] = useState(1);
  const [enonce, setEnonce] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [bonneReponseIndex, setBonneReponseIndex] = useState(0);
  const [niveau, setNiveau] = useState('');
  const [message, setMessage] = useState('');
  const [erreurs, setErreurs] = useState<any>({});

  useEffect(() => {
    if (!token) navigate('/connexion');
  }, [token]);

  const resetChampQuestion = () => {
    setEnonce('');
    setOptions(['', '', '', '']);
    setBonneReponseIndex(0);
    setNiveau('');
    setErreurs({});
  };

  const validerChamps = () => {
    const errs: any = {};
    if (!titre.trim()) errs.titre = 'Le titre est requis.';
    if (!categorie) errs.categorie = 'La catégorie est requise.';
    if (!enonce.trim()) errs.enonce = 'L’énoncé est requis.';
    options.forEach((opt, i) => {
      if (!opt.trim()) errs[`option${i}`] = `L’option ${i + 1} est requise.`;
    });
    if (!niveau) errs.niveau = 'Le niveau est requis.';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const champsInvalide = validerChamps();
    setErreurs(champsInvalide);
    if (Object.keys(champsInvalide).length > 0) return;

    const question: IQuestion = {
      enonce,
      options,
      bonneReponseIndex,
      niveau: niveau as 'facile' | 'moyen' | 'difficile',
    };

    const updatedQuestions = [...questions, question];
    setQuestions(updatedQuestions);
    resetChampQuestion();

    if (indexQuestion === 10) {
      const quiz: IQuiz = {
        titre,
        categorie,
        questions: updatedQuestions,
        createurNom: nomUtilisateur || '',
      };

      try {
        await api.post('/quizzs/add', { quiz });
        setMessage('Quiz créé avec succès 🎉');
        setTimeout(() => navigate('/quizzs'), 1500);
      } catch (err) {
        console.error(err);
        setMessage('Erreur lors de la création du quiz.');
      }
    } else {
      setIndexQuestion(indexQuestion + 1);
    }
  };

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
            <Typography variant="h5" gutterBottom>Créer un quiz</Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Titre du quiz"
                fullWidth
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                error={!!erreurs.titre}
                helperText={erreurs.titre}
                sx={{ mt: 2 }}
              />

              <FormControl fullWidth error={!!erreurs.categorie} sx={{ mt: 2 }}>
                <InputLabel id="categorie-label">Catégorie</InputLabel>
                <Select
                  labelId="categorie-label"
                  value={categorie}
                  label="Catégorie"
                  onChange={(e) => setCategorie(e.target.value)}
                >
                  {['Culture générale', 'Sport', 'Géographie', 'Histoire', 'Sciences', 'Informatique'].map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {erreurs.categorie && <FormHelperText>{erreurs.categorie}</FormHelperText>}
              </FormControl>

              <Typography variant="h6" sx={{ mt: 4 }}>Question {indexQuestion} / 10</Typography>

              <TextField
                label="Énoncé"
                fullWidth
                value={enonce}
                onChange={(e) => setEnonce(e.target.value)}
                error={!!erreurs.enonce}
                helperText={erreurs.enonce}
                sx={{ mt: 2 }}
              />

              {options.map((opt, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  fullWidth
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  error={!!erreurs[`option${index}`]}
                  helperText={erreurs[`option${index}`]}
                  sx={{ mt: 2 }}
                />
              ))}

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="bonne-reponse-label">Bonne réponse</InputLabel>
                <Select
                  labelId="bonne-reponse-label"
                  value={bonneReponseIndex}
                  label="Bonne réponse"
                  onChange={(e) => setBonneReponseIndex(Number(e.target.value))}
                >
                  {options.map((opt, index) => (
                    <MenuItem key={index} value={index}>
                      {opt || `Option ${index + 1}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth error={!!erreurs.niveau} sx={{ mt: 2 }}>
                <InputLabel id="niveau-label">Niveau</InputLabel>
                <Select
                  labelId="niveau-label"
                  value={niveau}
                  label="Niveau"
                  onChange={(e) => setNiveau(e.target.value)}
                >
                  <MenuItem value="facile">Facile</MenuItem>
                  <MenuItem value="moyen">Moyen</MenuItem>
                  <MenuItem value="difficile">Difficile</MenuItem>
                </Select>
                {erreurs.niveau && <FormHelperText>{erreurs.niveau}</FormHelperText>}
              </FormControl>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 4 }}>
                {indexQuestion === 10 ? 'Terminer et créer le quiz' : 'Question suivante'}
              </Button>
            </form>

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
