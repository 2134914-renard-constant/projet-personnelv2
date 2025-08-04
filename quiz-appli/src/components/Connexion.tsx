import { useState } from 'react';
import {
    Container, Card, CardContent, TextField, Typography, Button, Link as MuiLink
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function Connexion() {
    const [nom, setNom] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();
    const { setToken } = useAuth();

    const handleLogin = async () => {
  try {
    const res = await axios.post('http://localhost:3000/generatetoken', {
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
      setErreur('Identifiants invalides.');
    }
  } catch {
    setErreur('Erreur de connexion.');
  }
};

    return (
        <Container maxWidth="xs" sx={{ mt: 8 }}>
            <Card>
                <CardContent>
                    <Typography variant="h5" textAlign="center" gutterBottom>
                        Connexion
                    </Typography>
                    <TextField
                        label="Nom utilisateur"
                        fullWidth
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
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
                    <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleLogin}>
                        Se connecter
                    </Button>
                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        Vous n'avez pas de compte ?{' '}
                        <MuiLink component={Link} to="/creer-compte">Créer un compte</MuiLink>
                    </Typography>
                </CardContent>
            </Card>
        </Container>
    );
}
