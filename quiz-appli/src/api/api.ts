import axios from 'axios';

// hook pour accéder au contexte d’authentification
import { useAuth } from '../contexts/AuthContext';

// Hook qui retourne une instance Axios avec le token JWT si disponible
export function useApi() {
  // Récupère le token depuis le contexte d’authentification
  const { token } = useAuth();

  // Crée une instance Axios avec des en-têtes par défaut
  const apiInstance = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json', 
      // Si un token est présent, ajoute l'en-tête Authorization avec le JWT
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  console.log('🔐 Token utilisé :', token);

  return apiInstance;
}
