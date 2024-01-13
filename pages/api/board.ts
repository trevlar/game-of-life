import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST' && process.env.NODE_ENV === 'development') {
    try {
      const payload = req.body;

      const settings = await prisma.gameSettings.create({
        data: {
          boardSize: payload.settings.boardSize,
          gameSpeed: payload.settings.gameSpeed,
          gensPerAdvance: payload.settings.generationsPerAdvance,
          wrapAround: payload.settings.wrapAround,
        },
      });

      const gameState = await prisma.gameStates.create({
        data: {
          title: payload.title,
          boardDesc: payload.description,
          livingCells: JSON.stringify(payload.livingCells),
          settingsId: settings.id,
          isPlaying: payload.isPlaying,
          livingCellCount: payload.livingCellCount,
          board: payload.board || '',
          virtualBoard: payload.virtualBoard || '',
          generations: payload.generations,
        },
      });

      res.status(200).json({ id: gameState.id });
    } catch (error) {
      console.error('Error saving board:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
