import useGoogleSheets from 'use-google-sheets';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './Home';
import Inventory from './Inventory';
import Palettes from './Palettes';

import './App.css';

export type Thread = {
  number: string;
  name?: string;
  owned: boolean;
};

export type CommonPalette = {
  date: string;
  post_link: string;
  photo_link: string;
};

export type RawPalette = CommonPalette & {
  thread_1: string;
  thread_2: string;
  thread_3: string;
  thread_4: string;
  thread_5: string;
  thread_6: string;
};

export type Palette = CommonPalette & {
  threads: (string | number)[];
};

function App() {
  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_API_KEY || '',
    sheetId: process.env.REACT_APP_SHEETS_ID || '',
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  const sortThreads = (threads: string[]): (string | number)[] => {
    const sortedThreads = threads.reduce(
      (acc: { str: string[]; num: number[] }, thread) => {
        if (Number.isNaN(Number(thread))) return { ...acc, str: [...acc.str, thread].sort() };
        return { ...acc, num: [...acc.num, Number(thread)].sort((a, b) => a - b) };
      },
      { str: [], num: [] }
    );
    return [...sortedThreads.str, ...sortedThreads.num];
  };

  const parsePalettes = (palettes: RawPalette[]): Palette[] => {
    const parsed = palettes.map((palette) => {
      const { thread_1, thread_2, thread_3, thread_4, thread_5, thread_6, ...rest } = palette;

      const threads = [thread_1, thread_2, thread_3, thread_4, thread_5, thread_6];
      const eachPalettes = { ...rest, threads: sortThreads(threads) };
      return eachPalettes;
    });

    return parsed;
  };

  const inventory = data[0].data as Thread[];
  const palettes = parsePalettes(data[1].data as RawPalette[]);

  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/inventory">Inventory</Link>
            </li>
            <li>
              <Link to="/palettes">Palettes</Link>
            </li>
          </ul>
        </nav>
        <header className="App-header">
          <div>
            <Routes>
              <Route path="/inventory" element={<Inventory inventory={inventory} />} />
              <Route path="/palettes" element={<Palettes inventory={inventory} palettes={palettes} />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </header>
      </div>
    </Router>
  );
}

export default App;
