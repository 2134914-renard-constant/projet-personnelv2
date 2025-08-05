import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interface représentant les données contenues dans le token JWT
interface TokenPayload {
  id: string;
  nomUtilisateur: string;
  exp: number; 
}

// Interface de la structure des données fournies par le contexte d’authentification
interface AuthContextType {
  token: string | null;
  nomUtilisateur: string | null;
  utilisateurId: string | null;
  setToken: (val: string | null) => void;
  deconnexion: () => void;
}

// Création du contexte d’authentification 
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Composant React qui fournit le contexte d’authentification à ses enfants
export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [nomUtilisateur, setNomUtilisateur] = useState<string | null>(null);
  const [utilisateurId, setUtilisateurId] = useState<string | null>(null);

  // s’exécute à chaque changement du token
  useEffect(() => {
    if (token) {
      try {
        // Décode le token JWT pour en extraire les infos de l’utilisateur
        const decoded = jwtDecode<TokenPayload>(token);
        setNomUtilisateur(decoded.nomUtilisateur);
        setUtilisateurId(decoded.id);
      } catch {
        // Si le token est invalide ou corrompu, réinitialiser les valeurs
        setNomUtilisateur(null);
        setUtilisateurId(null);
      }
    } else {
      // Si aucun token n’est présent, vider les valeurs
      setNomUtilisateur(null);
      setUtilisateurId(null);
    }
  }, [token]);

  const deconnexion = () => {
    setToken(null);
    setNomUtilisateur(null);
    setUtilisateurId(null);
  };

  // Affiche dans la console le nom d’utilisateur connecté (utile pour le debug)
  console.log('nomUtilisateur connecté:', nomUtilisateur);

  // Fournit les valeurs du contexte aux composants enfants
  return (
    <AuthContext.Provider value={{ token, nomUtilisateur, utilisateurId, setToken, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour utiliser le contexte d’authentification
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Si on tente d’utiliser ce hook en dehors du Provider, on lance une erreur claire
    throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  }
  return context;
}
