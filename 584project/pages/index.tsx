import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [steamUrl, setSteamUrl] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSteamUrl(event.target.value);
  };

  const extractSteamId = async (url: string): Promise<string> => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === 'steamcommunity.com') {
        if (parsedUrl.pathname.startsWith('/profiles/')) {
          const steamId = parsedUrl.pathname.split('/')[2];
          const steamIdNumber = parseInt(steamId, 10);
          if (!isNaN(steamIdNumber)) {
            return steamId;
          }
        } else if (parsedUrl.pathname.startsWith('/id/')) {
          const vanityUrl = parsedUrl.pathname.split('/')[2];
          const steamId = await resolveVanityUrl(vanityUrl);
          return steamId;
        }
      }
    } catch (error) {
      // Invalid URL
    }
    return '';
  };

  const resolveVanityUrl = async (vanityUrl: string) => {
    const response = await fetch(`/api/steam?action=resolvevanityurl&vanityUrl=${vanityUrl}`);
    const data = await response.json();
    return data.steamId;
  };

  const fetchOwnedGames = async () => {
    const steamId = await extractSteamId(steamUrl); 
    if (!steamId) return;
  
    const response = await fetch(`/api/steam?action=getownedgames&steamId=${steamId}`);
    const data = await response.json();
    console.log(data);
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono lg:flex flex-col">
        <p className="font-mono text-5xl lg:text-2x1 fixed left-0 top-0 flex w-full items-center justify-center border-b border-gray-300 bg-gray-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/60 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/60">
          We'll pick a game for you!
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-2/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
        <Image
          src="/steam.png"
          alt="Steam Logo"
          width={450}
          height={250}
          priority
        />
      </div>

      <form className="w-96 max-w-3xl mx-auto">
        <div className="mb-4">
          <label className="block font-mono text-3xl text-gray-200 mb-2" htmlFor="user">
            Enter User URL
          </label>
          <input
            className="appearance-none font-mono italic border rounded w-full py-2 px-3 text-gray-600 leading-tight focus:outline-none focus:shadow-outline"
            id="url"
            type="text"
            placeholder="Example: https://steamcommunity.com/profiles/XXXX/"
            value={steamUrl}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
            type="button"
            onClick={fetchOwnedGames}
          >
            Search
          </button>
        </div>
      </form>
    </main>
  )
}
