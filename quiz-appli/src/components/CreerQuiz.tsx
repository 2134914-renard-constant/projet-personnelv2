import { useState, useEffect } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button,
  MenuItem, Select, InputLabel, FormControl, Box, FormHelperText,
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../api/api';
import type { IQuiz } from '../models/iQuiz';
import type { IQuestion } from '../models/iQuestion';

/**
 * Composant de formulaire permettant à un utilisateur connecté de créer un quiz avec 10 questions, chacune avec 4 options et une bonne réponse
 */
export default function CreerQuiz() {
  const { token, utilisateurId } = useAuth();
  const navigate = useNavigate();
  const api = useApi();

  // États pour les champs du quiz
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState('');
  const [enonce, setEnonce] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [bonneReponseIndex, setBonneReponseIndex] = useState(0);
  const [niveau, setNiveau] = useState('');
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [indexQuestion, setIndexQuestion] = useState(1);
  const [message, setMessage] = useState('');

  // États pour la validation
  const [erreurTitre, setErreurTitre] = useState('');
  const [erreurCategorie, setErreurCategorie] = useState('');
  const [erreurEnonce, setErreurEnonce] = useState('');
  const [erreursOptions, setErreursOptions] = useState<string[]>(['', '', '', '']);
  const [erreurNiveau, setErreurNiveau] = useState('');

  // Redirige si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!token) navigate('/connexion');
  }, [token]);

  /**
   * Réinitialise les champs de la question après son ajout
   */
  const resetChampsQuestion = () => {
    setEnonce('');
    setOptions(['', '', '', '']);
    setBonneReponseIndex(0);
    setNiveau('');
    setErreurEnonce('');
    setErreursOptions(['', '', '', '']);
    setErreurNiveau('');
  };

  /**
   * Valide les champs du formulaire de question
   * Vérifie que chaque champ est rempli et conforme
   *
   * @returns {boolean} true si les champs sont valides sinon flase
   */
  const validerChamps = () => {
    let valide = true;

    setErreurTitre('');
    setErreurCategorie('');
    setErreurEnonce('');
    setErreurNiveau('');
    setErreursOptions(['', '', '', '']);
    const erreurOption = options.map(opt =>
      !opt.trim() ? 'Cette option est requise.' : ''
    );
    if (!titre.trim()) {
      setErreurTitre('Le titre est requis.');
      valide = false;
    } else if (!categorie) {
      setErreurCategorie('La catégorie est requise.');
      valide = false;
    } else if (!enonce.trim()) {
      setErreurEnonce("L'énoncé est requis.");
      valide = false;
    } else if (erreurOption.some(msg => msg)) {
      setErreursOptions(erreurOption);
      valide = false;
    } else if (!niveau) {
      setErreurNiveau('Le niveau est requis.');
      valide = false;
    }

    return valide;
  };

  /**
   * Gère la soumission du formulaire de question/quiz
   * Si c’est la 10e question envoie du quiz complet à l’API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validerChamps()) {
      const question: IQuestion = {
        enonce,
        options,
        bonneReponseIndex,
        niveau: niveau as 'facile' | 'moyen' | 'difficile',
      };

      const questionsModifie = [...questions, question];
      setQuestions(questionsModifie);
      resetChampsQuestion();

      if (indexQuestion === 10) {
        const quiz: IQuiz = {
          titre,
          categorie,
          questions: questionsModifie,
          createur: utilisateurId || '',
        };

        try {
          await api.post('/quizzs/add', { quiz });
          setMessage('Quiz créé avec succès');
          setTimeout(() => navigate('/quizzs'), 1500);
        } catch (err) {
          console.error(err);
          setMessage('Erreur lors de la création du quiz.');
        }
      } else {
        setIndexQuestion(indexQuestion + 1);
      }
    }


  };

  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(to right, #e0f7fa, #fff)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflow: 'auto',
      padding: 2,
      mt: 7,

    }}>
      <Container maxWidth="sm">
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
          <CardContent sx={{ flexGrow: 1, overflowY: 'auto', paddingRight: 2, paddingBottom: 2 }}>
            {/* Bouton retour */}
            <Tooltip title="Retour à la liste des quiz">
              <Button
                onClick={() => navigate('/quizzs')}
                sx={{ mb: 2 }}
                variant="outlined"
              >
                <ArrowBackIcon />
              </Button>
            </Tooltip>
            <Typography variant="h5" gutterBottom>Créer un quiz</Typography>
            {/* Formulaire de création de quiz */}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Titre du quiz"
                fullWidth
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                error={!!erreurTitre}
                helperText={erreurTitre}
                sx={{ mt: 2 }}
              />
              {/* Sélection Catégorie */}
              <FormControl fullWidth error={!!erreurCategorie} sx={{ mt: 2 }}>
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
                {erreurCategorie && <FormHelperText>{erreurCategorie}</FormHelperText>}
              </FormControl>
              {/* Affichage numéro de la question */}
              <Typography variant="h6" sx={{ mt: 4 }}>Question {indexQuestion} / 10</Typography>
              {/* Champ Enoncé */}
              <TextField
                label="Énoncé"
                fullWidth
                value={enonce}
                onChange={(e) => setEnonce(e.target.value)}
                error={!!erreurEnonce}
                helperText={erreurEnonce}
                sx={{ mt: 2 }}
              />
              {/* Champs des options */}
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
                  error={!!erreursOptions[index]}
                  helperText={erreursOptions[index]}
                  sx={{ mt: 2 }}
                />
              ))}

              {/* Sélection de la bonne réponse */}
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

              <FormControl fullWidth error={!!erreurNiveau} sx={{ mt: 2 }}>
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
                {erreurNiveau && <FormHelperText>{erreurNiveau}</FormHelperText>}
              </FormControl>

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 4 }}>
                {indexQuestion === 10 ? 'Terminer et créer le quiz' : 'Question suivante'}
              </Button>
            </form>

            {message && (
              <Typography
                textAlign="center"
                color={message.includes('succès') ? 'success.main' : 'error'}
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
