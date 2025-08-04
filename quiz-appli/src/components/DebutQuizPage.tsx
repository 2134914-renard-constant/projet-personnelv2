import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';

// Interface des props attendues
interface Props {
  nomUtilisateur: string;                     
  erreurNom: string;                          
  setNomUtilisateur: (val: string) => void;   
  setErreurNom: (val: string) => void;        
  setDebut: (val: boolean) => void;           
  validerNomUtilisateur: (nom: string) => string; 
}

export default function DebutQuizPage({
  nomUtilisateur,
  erreurNom,
  setNomUtilisateur,
  setErreurNom,
  setDebut,
  validerNomUtilisateur,
}: Props) {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(to right, #e0f7fa, #fff)', // Fond doux
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 4, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h4" textAlign="center" fontWeight={600} gutterBottom>
            Commencer le quiz
          </Typography>

          {/* Message d’introduction */}
          <Typography variant="body1" color="text.secondary" textAlign="center" gutterBottom>
            Entrez votre nom pour participer au classement.
          </Typography>

          {/* Champ de texte pour le nom */}
          <TextField
            label="Nom ou pseudo"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            error={!!erreurNom}
            helperText={erreurNom}
          />

          {/* Bouton pour démarrer le quiz */}
          <Button
            onClick={() => {
              const err = validerNomUtilisateur(nomUtilisateur); 
              if (err) {
                setErreurNom(err);
              } else {
                setErreurNom('');
                setDebut(true); 
              }
            }}
            variant="contained"
            size="large"
            sx={{ mt: 3, borderRadius: 2 }}
            fullWidth
          >
            Commencer
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
