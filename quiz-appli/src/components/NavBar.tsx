import { Outlet, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Button, Box, CssBaseline,
  Container, Tooltip, IconButton
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



export default function NavBar() {
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

          {/* Icône de connexion à droite */}
          <Box>
            <Tooltip title="Connexion">
              <IconButton color="inherit" component={Link} to="/connexion">
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Décalage de la hauteur de la AppBar */}
      <Toolbar />

      {/* Contenu principal */}
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f9f9f9', p: 3 }}>
        <Container sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </>
  );
}
