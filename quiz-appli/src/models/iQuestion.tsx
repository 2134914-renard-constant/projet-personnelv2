export interface IQuestion {
  enonce: string;
  options: string[];
  bonneReponseIndex: number;
  niveau: 'facile' | 'moyen' | 'difficile';
}