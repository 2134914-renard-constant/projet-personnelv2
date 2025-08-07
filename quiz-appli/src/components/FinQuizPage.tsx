import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Interface des props attendues par le composant
interface Props {
  score: number;
  questions: any[];
}

/**
 * Composant affiché à la fin du quiz
 * Affiche un message de fin, le score obtenu et un bouton pour revenir à la liste des quiz
 *
 * @param {Props} props - Le score final et la liste des questions
 */
export default function FinQuiz({ score, questions }: Props) {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to right, #e0f7fa, #fff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {/* Carte contenant le message de fin */}
      <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, boxShadow: 6, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Quiz terminé !
          </Typography>

          <Typography variant="h6" color="text.secondary" gutterBottom>
            Ton score :
          </Typography>

          {/* Score affiché en grand */}
          <Typography variant="h3" color="primary" fontWeight={700} sx={{ mt: 1, mb: 3 }}>
            {score} / {questions.length}
          </Typography>

          {/* Bouton retour aux quiz */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/quizzs')}
            sx={{ borderRadius: 2, mb: 2 }}
            fullWidth
          >
            Retour aux quiz
          </Button>

          {/* Bouton : Voir le classement */}
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/classement')}
            sx={{ borderRadius: 2 }}
            fullWidth
          >
            Voir le classement
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
