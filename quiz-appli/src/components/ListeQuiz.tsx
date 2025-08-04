import { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Grid, Container,
  Paper, FormControl, InputLabel, Select, MenuItem, IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../api/api';

const categoriesDisponibles = ['Sport', 'Histoire', 'Géographie', 'Culture générale', 'Mathématiques'];

export default function ListeQuiz() {
  const [quizzs, setQuizzs] = useState<any[]>([]);
  const [categorie, setCategorie] = useState<string>('Culture générale');
  const { nomUtilisateur, token } = useAuth();
  const api = useApi();

  useEffect(() => {
    api.get(`/quizzs/categorie/${encodeURIComponent(categorie)}`)
      .then((res) => setQuizzs(res.data.quizzs))
      .catch(console.error);
  }, [categorie]);

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
          <Typography
            variant="h4"
            textAlign="center"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            Liste des quiz
          </Typography>

          <FormControl fullWidth sx={{ my: 3 }}>
            <InputLabel id="categorie-label">Catégorie</InputLabel>
            <Select
              labelId="categorie-label"
              value={categorie}
              label="Catégorie"
              onChange={(e) => setCategorie(e.target.value)}
            >
              {categoriesDisponibles.map((cat, idx) => (
                <MenuItem key={idx} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={3} mt={2} justifyContent="center">
            {quizzs.map((quiz) => {
              const estCreateur = quiz.createur?.nomUtilisateur === nomUtilisateur;

              return (
                <Grid item xs={12} sm={6} md={3} key={quiz._id}>
                  <Card sx={{ borderRadius: 3, boxShadow: 4, height: '100%', position: 'relative' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {quiz.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Catégorie : {quiz.categorie}
                      </Typography>

                      <Button
                        component={Link}
                        to={`/quiz/${quiz._id}`}
                        variant="contained"
                        fullWidth
                      >
                        Commencer
                      </Button>

                      {token && estCreateur && (
                        <IconButton
                          component={Link}
                          to={`/modifier-quiz/${quiz._id}`}
                          color="primary"
                          sx={{ mt: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
