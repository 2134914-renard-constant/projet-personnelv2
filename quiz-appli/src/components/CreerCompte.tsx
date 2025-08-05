import { useState } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/api';

export default function CreerCompte() {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [erreurs, setErreurs] = useState<{ nom?: string, mot?: string, confirmation?: string }>({});
  const navigate = useNavigate();
  const api = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nouveauxErreurs: { nom?: string, mot?: string, confirmation?: string } = {};
    if (!nomUtilisateur.trim()) {
      nouveauxErreurs.nom = 'Le nom d’utilisateur est requis';
    }
    if (!motDePasse) {
      nouveauxErreurs.mot = 'Le mot de passe est requis';
    }
    if (motDePasse !== confirmation) {
      nouveauxErreurs.confirmation = 'Les mots de passe ne correspondent pas';
    }

    setErreurs(nouveauxErreurs);
    if (Object.keys(nouveauxErreurs).length > 0) return;

    try {
      await api.post('/users/add', {
        utilisateur: {
          nomUtilisateur,
          motDePasse,
        },
      });
      navigate('/connexion');
    } catch {
      setMessage("Erreur lors de la création du compte.");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Créer un compte
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Nom d’utilisateur"
              fullWidth
              value={nomUtilisateur}
              onChange={(e) => setNomUtilisateur(e.target.value)}
              error={!!erreurs.nom}
              helperText={erreurs.nom}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              error={!!erreurs.mot}
              helperText={erreurs.mot}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Confirmer le mot de passe"
              type="password"
              fullWidth
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              error={!!erreurs.confirmation}
              helperText={erreurs.confirmation}
              sx={{ mt: 2 }}
            />

            {message && (
              <Typography color="error" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
              Créer le compte
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
