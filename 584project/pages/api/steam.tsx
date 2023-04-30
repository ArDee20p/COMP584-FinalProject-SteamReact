import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

interface VanityURLResponse {
  response: {
    steamid: string;
    success: number;
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { action, steamId, vanityUrl } = req.query;

  if (action === 'getownedgames') {
    const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=0E00F7EF0B2F059F483C5D2AE58213B6&steamid=${steamId}&format=json`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching owned games' });
    }
  } else if (action === 'resolvevanityurl') {
    const url = `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=0E00F7EF0B2F059F483C5D2AE58213B6&vanityurl=${vanityUrl}`;

    try {
      const response = await fetch(url);
      const data = (await response.json()) as VanityURLResponse;
      const steamId = data.response.steamid;
      res.status(200).json({ steamId });
    } catch (error) {
      res.status(500).json({ error: 'Error resolving vanity URL' });
    }
  } else {
    res.status(400).json({ error: 'Invalid action' });
  }
};

export default handler;



