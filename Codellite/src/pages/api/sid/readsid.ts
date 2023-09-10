'use server'

import fs from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

type Data = {
    exists: boolean;
    message: string;
}

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method not allowed
  }

  const { number } = req.body;

  if (number === undefined || isNaN(number)) {
    return res.status(400).json({ error: 'Invalid number' });
  }

  try {
    // Define the path to the numbers file
    const directoryPath = `./src/sid/`;
    const filePath = path.join(directoryPath, 'sid.txt');

    // Read the file and check if the number exists
    const data = await fs.readFile(filePath, 'utf8');
    const numbers = data.split('\n').map((n) => parseInt(n));
    const exists = numbers.includes(number);
    
    return res.status(200).json({ exists: exists, message: "ok!" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ exists: true, message: 'Failed to read file' });
  }
}
