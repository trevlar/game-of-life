// pages/api/boards.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

type SavedGame = {
  id: number;
  title: string;
  boardDesc: string | null;
  generations: number;
  isPlaying: boolean;
  livingCellCount: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SavedGame[] | { message: string }>
) {
  if (req.method === 'GET') {
    try {
      const boardsList = await prisma.gameStates.findMany({
        select: {
          id: true,
          title: true,
          boardDesc: true,
          generations: true,
          isPlaying: true,
          livingCellCount: true,
        },
      });

      res.status(200).json(boardsList);
    } catch (err) {
      console.error('Error getting boards list:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
