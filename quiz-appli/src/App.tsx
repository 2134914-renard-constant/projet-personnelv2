import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import NavBar from './components/NavBar';
import Accueil from './components/Accueil';
import ListeQuizzs from './components/ListeQuiz';
import Quiz from './components/Quiz';
import Classement from './components/Classement';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Connexion from './components/Connexion';
import CreerCompte from './components/CreerCompte';
import CreerQuiz from './components/CreerQuiz';
import ModifierQuiz from './components/ModifierQuiz';

const theme = createTheme({
  palette: {
    mode: 'light', // ou 'dark'
    primary: {
      main: '#1976d2', // couleur principale
    },
    secondary: {
      main: '#f50057', // couleur secondaire
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavBar />}>
          <Route index element={<Accueil />} />
          <Route path="quizzs" element={<ListeQuizzs />} />
          <Route path="quiz/:id" element={<Quiz />} />
          <Route path="classement" element={<Classement />} />
          <Route path="connexion" element={<Connexion />} />
          <Route path="creer-compte" element={<CreerCompte />} />
          <Route path="creer-quiz" element={<CreerQuiz />} />
          <Route path="modifier-quiz/:id" element={<ModifierQuiz />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
