import { useState } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button, Link as MuiLink, Box
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../api/api';

export default function Connexion() {
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurNom, setErreurNom] = useState('');
  const [erreurMotDePasse, setErreurMotDePasse] = useState('');
  const [erreurConnexion, setErreurConnexion] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const api = useApi();

  const validerNom = (nom: string) => {
    if (!nom.trim()){
      return 'Le nom est requis.';
    }
    else if (nom.trim().length < 3) {
      return 'Le nom doit contenir au moins 3 caractères.';
    }
    return '';
  };

  const validerMotDePasse = (mdp: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!mdp.trim()) {
      return 'Le mot de passe est requis.';
    } else if (!regex.test(mdp)) {
      return '8 caractères ou plus avec au moins une lettre et un chiffre.';
    }
    return '';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const errNom = validerNom(nom);
    const errMdp = validerMotDePasse(motDePasse);
    setErreurNom(errNom);
    setErreurMotDePasse(errMdp);
    setErreurConnexion('');

    if (errNom || errMdp) return;

    try {
      const res = await api.post('/generatetoken', {
        userlogin: {
          nomUtilisateur: nom,
          motDePasse,
        },
      });

      const token = res.data.token;
      if (token) {
        setToken(token);
        navigate('/quizzs');
      } else {
        setErreurConnexion('Identifiants invalides.');
      }
    } catch {
      setErreurConnexion('Erreur de connexion.');
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
      <Container maxWidth="xs">
        <Card>
          <CardContent>
            <Typography variant="h4" textAlign="center" gutterBottom>
              Connexion
            </Typography>

            <form onSubmit={handleLogin}>
              <TextField
                label="Nom d’utilisateur"
                fullWidth
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                error={!!erreurNom}
                helperText={erreurNom}
                sx={{ mt: 2 }}
              />

              <TextField
                label="Mot de passe"
                type="password"
                fullWidth
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                error={!!erreurMotDePasse}
                helperText={erreurMotDePasse}
                sx={{ mt: 2 }}
              />

              {erreurConnexion && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {erreurConnexion}
                </Typography>
              )}

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
                Se connecter
              </Button>
            </form>

            <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
              Vous n'avez pas de compte ?{' '}
              <MuiLink component={Link} to="/creer-compte">Créer un compte</MuiLink>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
