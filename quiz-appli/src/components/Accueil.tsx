import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import Leaderboard from '@mui/icons-material/Leaderboard';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { Link } from 'react-router-dom';

export default function Accueil() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to right, #e0f7fa, #fff)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center', 
      }}
    >
      <Card
        elevation={8}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '90%',
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', 
        }}
      >
        <CardContent>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Quiz
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Testez vos connaissances, créez vos propres quiz, et regardez si vous faites partie des meilleurs !
          </Typography>

          <Stack spacing={2}>
            <Button startIcon={<PlayArrow />} variant="contained" component={Link} to="/quizzs">
              Lancer un quiz
            </Button>

            <Button startIcon={<AddCircleOutline />} variant="outlined" component={Link} to="/creer-quiz">
              Créer un quiz
            </Button>
            
            <Button startIcon={<Leaderboard />} variant="text" component={Link} to="/classement">
              Voir les classements
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
