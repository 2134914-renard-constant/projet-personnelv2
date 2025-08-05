import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Button, Box, CssBaseline,
  Container, Tooltip, IconButton
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const { token, deconnexion } = useAuth();
  const navigate = useNavigate();

  const handleDeconnexion = () => {
    deconnexion();
    navigate('/');
  };

  return (
    <>
      <CssBaseline />

      {/* Barre de navigation en haut */}
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Boutons à gauche */}
          <Box>
            <Button color="inherit" component={Link} to="/">Accueil</Button>
            <Button color="inherit" component={Link} to="/quizzs">Quiz</Button>
            <Button color="inherit" component={Link} to="/classement">Classement</Button>
          </Box>

          {/* Icône de connexion ou deconnexion si l'utilisateur est connecté à droite */}
          <Box>
            {!token ? (
            <Tooltip title="Connexion">
              <IconButton color="inherit" component={Link} to="/connexion">
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
              ) : (<Tooltip title="Déconnexion">
                <IconButton color="inherit" onClick={handleDeconnexion}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Contenu principal */}
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9', p: 3 }}>
        <Container sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </>
  );
}
