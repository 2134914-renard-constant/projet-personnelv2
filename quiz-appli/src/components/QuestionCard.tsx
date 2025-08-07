import { Box, Button, Card, CardContent, Chip, LinearProgress, Typography } from '@mui/material';

// Définition des props attendues par le composant 
interface Props {
  titre: string;
  index: number;
  questions: any[];
  choix: number | null;
  setChoix: (val: number) => void;
  suivant: () => void;
  tempsRestant: number;
}

/**
 * Composant qui affiche une question du quiz avec ses choix, une barre de temps et un bouton pour avancer à la prochaine question.
 *
 * @param {Props} props - Données nécessaires pour afficher la question actuelle.
 */
export default function QuestionCard({
  titre,
  index,
  questions,
  choix,
  setChoix,
  suivant,
  tempsRestant,
}: Props) {
  // extrait la question actuelle à partir de l'index
  const question = questions[index];
  const niveau = question.niveau;

  /**
   * Retourne une couleur selon le niveau de difficulté
   *
   * @param niveau Le niveau ("facile", "moyen", "difficile")
   * @returns Une couleur
   */
  const getCouleurNiveau = (niveau: string) => {
    switch (niveau) {
      case 'facile': return 'success';
      case 'moyen': return 'warning';
      case 'difficile': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to right, #e0f7fa, #fff)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      {/* Carte contenant la question, les options et les boutons */}
      <Card
        sx={{
          width: '100%',
          maxWidth: 500,
          maxHeight: '90vh',
          overflowY: 'auto',
          p: 3,
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardContent>
          {/* Titre du quiz */}
          <Typography variant="h5" textAlign="center" fontWeight={600} gutterBottom>
            {titre}
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle2">
              Question {index + 1} / {questions.length}
            </Typography>
            <Chip
              // Capitalise la première lettre
              label={niveau.charAt(0).toUpperCase() + niveau.slice(1)}
              color={getCouleurNiveau(niveau)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          {/* Barre de progression représentant le temps restant */}
          <LinearProgress
            variant="determinate"
            value={(tempsRestant / 15) * 100}
            sx={{ height: 6, borderRadius: 4, mb: 2 }}
          />

          {/* Affichage du temps restant, en rouge si < 5 secondes */}
          <Typography
            color={tempsRestant <= 5 ? 'error' : 'text.secondary'}
            textAlign="center"
            fontSize="0.9rem"
            sx={{ mb: 2 }}
          >
            Temps restant : {tempsRestant} seconde{tempsRestant === 1 ? '' : 's'}
          </Typography>

          {/* Énoncé de la question */}
          <Typography variant="body1" fontWeight={500} textAlign="center" sx={{ mb: 2 }}>
            {question.enonce}
          </Typography>

          {/* Liste des boutons pour chaque option de réponse */}
          <Box display="flex" flexDirection="column" gap={1.5}>
            {question.options.map((opt: string, i: number) => (
              <Button
                key={i}
                // Style différent si sélectionné
                variant={choix === i ? 'contained' : 'outlined'}
                color={choix === i ? 'primary' : 'inherit'}
                onClick={() => setChoix(i)}
                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.95rem' }}
              >
                {opt}
              </Button>
            ))}
          </Box>

          {/* Bouton pour passer à la question suivante ou terminer */}
          <Button
            onClick={suivant}
            variant="contained"
            size="medium"
            // Désactivé tant que l'utilisateur n'a rien sélectionné
            disabled={choix === null}
            sx={{ mt: 3, borderRadius: 2 }}
            fullWidth
          >
            {index === questions.length - 1 ? 'Terminer le quiz' : 'Question suivante'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
