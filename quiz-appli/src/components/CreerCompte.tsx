import { useState } from 'react';
import {
  Container, Card, CardContent, TextField, Typography, Button, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../api/api';

/**
 * Composant permettant à un utilisateur de créer un compte
 */
export default function CreerCompte() {
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const [erreurNom, setErreurNom] = useState('');
  const [erreurMot, setErreurMot] = useState('');
  const [erreurConfirmation, setErreurConfirmation] = useState('');

  const navigate = useNavigate();
  const api = useApi();

  /**
   * Valide le champ du nom d'utilisateur
   * Vérifie que le champ n’est pas vide et contient au moins 3 caractères
   *
   * @param {string} nom - Le nom à valider
   * @returns {string} Message d’erreur s’il y a une erreur sinon une chaîne vide.
   */
  const validerNom = (nom: string) => {
    if (!nom.trim()) {
      return 'Le nom est requis.';
    } else if (nom.trim().length < 3) {
      return 'Au moins 3 caractères.';
    }
    return '';
  };

  /**
   * Valide le mot de passe
   * Doit contenir au moins une lettre, un chiffre et 8 caractères.
   *
   * @param {string} mdp - Le mot de passe à valider
   * @returns {string} Message d’erreur s’il y a une erreur sinon une chaîne vide
   */
  const validerMotDePasse = (mdp: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!mdp.trim()) {
      return 'Le mot de passe est requis.';
    } else if (!regex.test(mdp)) {
      return '8 caractères minimum avec lettre et chiffre.';
    }
    return '';

  };

  /**
   * Gère la soumission du formulaire
   * Vérifie la validité des champs et l’unicité du nom d’utilisateur puis crée le compte si tout est valide
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const errNom = validerNom(nomUtilisateur);
    const errMot = validerMotDePasse(motDePasse);
    const errConf = motDePasse !== confirmation ? 'Les mots de passe ne correspondent pas.' : '';

    setErreurNom(errNom);
    setErreurMot(errMot);
    setErreurConfirmation(errConf);

    if (errNom || errMot || errConf) return;

    // Vérifie que le nom d'utilisateur est unique
    const res = await api.post('/users/verifier-nom', { nom: nomUtilisateur });
    if (!res.data.unique) {
      setErreurNom("Ce nom d'utilisateur est déjà utilisé.");
      return;
    }

    // Envoie la demande de création à l'API
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
              Créer un compte
            </Typography>
            {/* Formulaire de création */}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nom d’utilisateur"
                fullWidth
                value={nomUtilisateur}
                onChange={(e) => setNomUtilisateur(e.target.value)}
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
                error={!!erreurMot}
                helperText={erreurMot}
                sx={{ mt: 2 }}
              />
              <TextField
                label="Confirmer le mot de passe"
                type="password"
                fullWidth
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                error={!!erreurConfirmation}
                helperText={erreurConfirmation}
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
    </Box>
  );
}
