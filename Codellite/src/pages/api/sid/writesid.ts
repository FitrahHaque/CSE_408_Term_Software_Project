'use server'

import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
type Data = {
  message: string;
}
export default async function handler(req:NextApiRequest, res:NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method not allowed
  }

  const { number } = req.body;

  if (number === undefined || isNaN(number)) {
    return res.status(400).json({ message: 'Invalid number' });
  }

  try {
    // Define the path to the numbers file
    const directoryPath = `./src/sid/`;
    const filePath = path.join(directoryPath, 'sid.txt');

    // Append the number to the file
    await fs.appendFile(filePath, `${number}\n`);

    return res.status(200).json({ message: 'Number written to file' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to write number to file' });
  }
}
