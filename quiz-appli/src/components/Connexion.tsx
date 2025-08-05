import { useState } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button, Link as MuiLink, Box
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../api/api';

/**
 * Composant de page de connexion
 * Permet à un utilisateur de saisir ses identifiants et d’obtenir un jeton d’authentification via l’API
 */
export default function Connexion() {
  const [nom, setNom] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurNom, setErreurNom] = useState('');
  const [erreurMotDePasse, setErreurMotDePasse] = useState('');
  const [erreurConnexion, setErreurConnexion] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const api = useApi();

  /**
   * Valide le nom d'utilisateur et vérifie qu'il est présent et contient au moins 3 caractères
   *
   * @param {string} nom - Le nom d’utilisateur à valider
   * @returns {string} Message d’erreur s’il y a une erreur sinon une chaîne vide.
   */
  const validerNom = (nom: string) => {
    if (!nom.trim()) {
      return 'Le nom est requis.';
    }
    else if (nom.trim().length < 3) {
      return 'Le nom doit contenir au moins 3 caractères.';
    }
    return '';
  };

  /**
   * Valide le mot de passe et vérifie qu’il contient au moins une lettre, un chiffre, et 8 caractères minimum.
   *
   * @param {string} mdp - Le mot de passe à valider
   * @returns {string} Message d’erreur s’il y a une erreur sinon une chaîne vide
   */
  const validerMotDePasse = (mdp: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!mdp.trim()) {
      return 'Le mot de passe est requis.';
    } else if (!regex.test(mdp)) {
      return '8 caractères ou plus avec au moins une lettre et un chiffre.';
    }
    return '';
  };

  /**
   * Gère la soumission du formulaire de connexion
   * Valide les champs et envoie les identifiants à l’API puis récupère le token et redirige vers la page des quiz en cas de succès
   */
  const handleConnexion = async (e: React.FormEvent) => {
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
        // Sauvegarde du token dans le contexte
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

            <form onSubmit={handleConnexion}>
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
