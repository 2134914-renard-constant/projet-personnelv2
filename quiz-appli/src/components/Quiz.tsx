import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '../api/api'; 
import type { IQuestion } from '../models/iQuestion';
import { CircularProgress, Typography } from '@mui/material';
import DebutQuizPage from '../components/DebutQuizPage';
import FinQuizPage from '../components/FinQuizPage';
import QuestionCard from '../components/QuestionCard';

export default function Quiz() {
  const { id } = useParams();
  const api = useApi(); 

  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [termine, setTermine] = useState(false);
  const [titre, setTitre] = useState('');
  const [tempsRestant, setTempsRestant] = useState(15);
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [debut, setDebut] = useState(false);
  const [erreurNom, setErreurNom] = useState('');
  const timeoutRef = useRef(false);

  // Charger les questions du quiz avec useApi
  useEffect(() => {
    if (id) {
      api.get(`/quizzs/${id}`)
        .then((res) => {
          const quiz = res.data.quiz;
          setTitre(quiz.titre);
          setQuestions(quiz.questions.slice(0, 10));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Gérer le timer
  useEffect(() => {
    if (!debut || termine) return;
    setTempsRestant(15);
    timeoutRef.current = false;

    const timer = setInterval(() => {
      setTempsRestant((t) => {
        if (t <= 1) {
          if (!timeoutRef.current) {
            timeoutRef.current = true;
            suivant();
          }
          return 15;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, debut, termine]);

  // Enregistrer le score à la fin du quiz
  useEffect(() => {
    if (termine && id && nomUtilisateur) {
      api.post('/resultats/add', {
        resultat: {
          quiz: id,
          score,
          nomUtilisateur,
        },
      }).catch(console.error);
    }
  }, [termine]);

  const suivant = () => {
    if (choix === questions[index]?.bonneReponseIndex) setScore((prev) => prev + 1);
    if (index === questions.length - 1) setTermine(true);
    else {
      setIndex((prev) => prev + 1);
      setChoix(null);
    }
  };

  const validerNomUtilisateur = (nom: string): string => {
    const nettoyé = nom.trim();
    if (nettoyé.length < 2 || nettoyé.length > 30) return "Le nom doit contenir entre 2 et 30 caractères.";
    if (!/^[a-zA-Z0-9À-ÿ\s_-]+$/.test(nettoyé)) return "Le nom contient des caractères non autorisés.";
    return '';
  };

  // Affichage selon l’état du quiz
  if (loading) {
    return <CircularProgress sx={{ m: 5 }} />;
  } else if (questions.length === 0) {
    return <Typography sx={{ mt: 4 }}>Aucune question trouvée.</Typography>;
  } else if (!debut) {
    return (
      <DebutQuizPage
        nomUtilisateur={nomUtilisateur}
        erreurNom={erreurNom}
        setNomUtilisateur={setNomUtilisateur}
        setErreurNom={setErreurNom}
        setDebut={setDebut}
        validerNomUtilisateur={validerNomUtilisateur}
      />
    );
  } else if (termine) {
    return <FinQuizPage score={score} questions={questions} />;
  } else {
    return (
      <QuestionCard
        titre={titre}
        index={index}
        questions={questions}
        choix={choix}
        setChoix={setChoix}
        suivant={suivant}
        tempsRestant={tempsRestant}
      />
    );
  }
}
