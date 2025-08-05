import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

/**
 * Intergiciel pour authentifier le jeton de l'utilisateur
 * inspirée du cours de dev web 3 
 * auteur : Constant Renard
 */
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(HttpStatusCodes.UNAUTHORIZED); 
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
    if (err) {
      return res.sendStatus(HttpStatusCodes.FORBIDDEN); 
    }

    // Injecter l'utilisateur dans la requête
    (req as any).utilisateur = {
      id: decoded.id,
      nomUtilisateur: decoded.nomUtilisateur,
    };

    next();
  });
}

export default authenticateToken;

