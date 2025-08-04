import { Box, Button, Card, CardContent, Typography } from '@mui/material';

// Interface des props attendues
interface Props {
  score: number;      
  questions: any[];   
}

export default function EndScreen({ score, questions }: Props) {
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
      <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, boxShadow: 6, textAlign: 'center' }}>
        <CardContent>
          {/* Message de fin */}
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

          {/* Bouton pour retourner à la liste des quiz */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => window.location.href = '/quizzs'}
            sx={{ borderRadius: 2 }}
            fullWidth
          >
            Retour aux quiz
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
