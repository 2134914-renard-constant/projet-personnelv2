import { Box, Typography, MenuItem, Select, FormControl, InputLabel, List, ListItem, ListItemText, Paper } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useEffect, useState } from 'react';
import { useApi } from '../api/api';

export default function Classement() {
  const [quizzs, setQuizzs] = useState<any[]>([]);
  const [quizId, setQuizId] = useState('');
  const [classement, setClassement] = useState<any[]>([]);
  const api = useApi();

  useEffect(() => {
    api.get('/quizzs/all').then((res) => setQuizzs(res.data.quizzs));
  }, []);

  useEffect(() => {
    if (quizId) {
      api.get(`/resultats/quiz/${quizId}`).then((res) => setClassement(res.data.classement));
    }
  }, [quizId]);

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to right, #e0f7fa, #fff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pt: 10,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 600,
          width: '100%',
          borderRadius: 4,
          boxShadow: 6,
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={600} textAlign="center" gutterBottom>
          Classement
        </Typography>

        <FormControl fullWidth sx={{ mt: 3, mb: 4 }}>
          <InputLabel id="quiz-select-label">Sélectionner un quiz</InputLabel>
          <Select
            labelId="quiz-select-label"
            value={quizId}
            label="Sélectionner un quiz"
            onChange={(e) => setQuizId(e.target.value)}
          >
            {quizzs.map((quiz) => (
              <MenuItem key={quiz._id} value={quiz._id}>
                {quiz.titre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {classement.length > 0 ? (
          <>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
              <EmojiEventsIcon color="primary" />
              <Typography variant="h6" fontWeight={500}>Top scores</Typography>
              <EmojiEventsIcon color="primary" />
            </Box>
            <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {classement.map((r, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: index === 0 ? '#e0f7fa' : 'transparent',
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={500}>
                        {index + 1}. {r.nomUtilisateur}
                      </Typography>
                    }
                    secondary={`Score : ${r.score}`}
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography color="text.secondary" textAlign="center">
            Aucun résultat pour ce quiz.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
