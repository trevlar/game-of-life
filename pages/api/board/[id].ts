import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SavedGame } from '../../../types/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const savedGame = await prisma.gameStates.findUnique({
        where: { id: Number(id) },
        include: { settings: true },
      });

      if (!savedGame) {
        return res.status(404).end('Game not found');
      }

      res.status(200).json(savedGame);
    } catch (error) {
      console.error('Error loading board:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT' && process.env.NODE_ENV === 'development') {
    try {
      const { id } = req.query; // Get the board ID from the URL

      const payload: SavedGame = JSON.parse(req.body);

      await prisma.gameSettings.update({
        where: { id: Number(payload.id) },
        data: {
          boardSize: payload?.settings?.boardSize,
          gameSpeed: payload?.settings?.gameSpeed,
          wrapAround: payload?.settings?.wrapAround,
        },
      });

      await prisma.gameStates.update({
        where: { id: Number(id) },
        data: {
          title: payload.title,
          boardDesc: payload.description,
          livingCells: JSON.stringify(payload.livingCells),
        },
      });

      res.status(200).json(payload);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    
    } else {
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
