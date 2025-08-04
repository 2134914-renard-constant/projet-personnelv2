import { useState } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/api';

export default function CreerCompte() {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();
  const api = useApi();

  const handleSubmit = async () => {
    try {
      await api.post('/users/add', {
        utilisateur: {
          nomUtilisateur,
          motDePasse,
        },
      });
      navigate('/connexion');
    } catch {
      setErreur("Erreur lors de la création du compte.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Créer un compte
          </Typography>
          <TextField
            label="Nom d’utilisateur"
            fullWidth
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            sx={{ mt: 2 }}
          />
          {erreur && (
            <Typography color="error" sx={{ mt: 2 }}>{erreur}</Typography>
          )}
          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
            Créer le compte
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
