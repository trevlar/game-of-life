import type { NextApiRequest, NextApiResponse } from 'next';

import prisma from '../../../lib/prisma';

const formatSavedGame = (savedGame) => ({
  id: savedGame.id,
  title: savedGame.title,
  description: savedGame.boardDesc || '',
  livingCells: savedGame.livingCells,
  generations: savedGame.generations,
  isPlaying: savedGame.isPlaying,
  livingCellCount: savedGame.livingCellCount,
  settings: savedGame.settings
    ? {
        boardSize: savedGame.settings.boardSize,
        gameSpeed: savedGame.settings.gameSpeed,
        generationsPerAdvance: savedGame.settings.gensPerAdvance,
        wrapAround: savedGame.settings.wrapAround,
      }
    : undefined,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid board id' });
  }

  if (req.method === 'GET') {
    try {
      const savedGame = await prisma.gameStates.findUnique({
        where: { id },
        include: { settings: true },
      });

      if (!savedGame) {
        return res.status(404).end('Game not found');
      }

      res.status(200).json(formatSavedGame(savedGame));
    } catch (error) {
      console.error('Error loading board:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT' && process.env.NODE_ENV === 'development') {
    try {
      const payload = req.body;
      const existingGame = await prisma.gameStates.findUnique({
        where: { id },
        include: { settings: true },
      });

      if (!existingGame) {
        return res.status(404).end('Game not found');
      }

      const updatedGame = await prisma.$transaction(async (tx) => {
        await tx.gameSettings.update({
          where: { id: existingGame.settingsId },
          data: {
            boardSize: payload.settings.boardSize,
            gameSpeed: payload.settings.gameSpeed,
            gensPerAdvance: payload.settings.generationsPerAdvance,
            wrapAround: payload.settings.wrapAround,
          },
        });

        return tx.gameStates.update({
          where: { id },
          data: {
            title: payload.title,
            boardDesc: payload.description,
            livingCells: JSON.stringify(payload.livingCells),
            generations: payload.generations,
            isPlaying: payload.isPlaying,
            livingCellCount: payload.livingCellCount,
          },
          include: { settings: true },
        });
      });

      res.status(200).json(formatSavedGame(updatedGame));
    } catch (error) {
      res
        .status(500)
        .json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
