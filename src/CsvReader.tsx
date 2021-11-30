import { useState } from 'react';
import classnames from 'classnames';

import './CsvReader.scss';

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

export default function CsvReader() {
  const [csvFileInventory, setCsvFileInventory] = useState<Blob>();
  const [csvFilePalettes, setCsvFilePalettes] = useState<Blob>();

  const [csvArrayInventory, setCsvArrayInventory] = useState<Thread[]>([]);
  const [csvArrayPalettes, setCsvArrayPalettes] = useState<Palette[]>([]);

  const parseThreadNumbers = (thread: string): string | number =>
    Number.isNaN(Number(thread)) ? thread : Number(thread);

  const processCSVInventory = (str: string, delim = ',') => {
    const headers = str
      .slice(0, str.indexOf('\n'))
      .split(delim)
      .map((header) => header.replace(/\r/, ''));
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const newArray = rows.map((row) => {
      const values = row.split(delim).map((val) => val.replace(/(\r\n|\n|\r)/gm, ''));
      const number = parseThreadNumbers(values[0]);
      const name = values[1];
      const owned = values[2] === 'X';
      return { number, name, owned } as Thread;
    });

    setCsvArrayInventory(newArray);
  };

  const processCSVPalettes = (str: string, delim = ',') => {
    const headers = str
      .slice(0, str.indexOf('\n'))
      .split(delim)
      .map((header) => header.replace(/\r/, ''));
    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const newArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj, header, i) => {
        const val = values[i].replace(/(\r\n|\n|\r)/gm, '');
        const newObj = { [header]: val, ...obj };
        return newObj;
      }, {} as RawPalette);
      const { thread_1, thread_2, thread_3, thread_4, thread_5, thread_6, ...rest } = eachObject;
      const threads = [thread_1, thread_2, thread_3, thread_4, thread_5, thread_6];
      const eachPalettes = { ...rest, threads: sortThreads(threads) };
      return eachPalettes;
    });

    setCsvArrayPalettes(newArray);
  };

  const submitInventory = () => {
    if (csvFileInventory) {
      const file = csvFileInventory;
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target?.result;
        if (text && typeof text === 'string') {
          processCSVInventory(text);
        }
      };

      reader.readAsText(file);
    }
  };

  const submitPalettes = () => {
    if (csvFilePalettes) {
      const file = csvFilePalettes;
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target?.result;
        if (text && typeof text === 'string') {
          processCSVPalettes(text);
        }
      };

      reader.readAsText(file);
    }
  };

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

  const getOwnedThreads = () => {
    if (csvArrayInventory.length === 0) return;
    const owned = csvArrayInventory.reduce(
      (acc: (string | number)[], item) => (item.owned ? [...acc, parseThreadNumbers(item.number)] : acc),
      []
    );
    return owned;
  };

  const ownedThreads = getOwnedThreads(); // TODO useMemo

  return (
    <div className="forms">
      <form id="csv-form-inventory">
        <h2>Inventory</h2>
        <input
          type="file"
          accept=".csv"
          id="csvFileInventory"
          onChange={(e) => {
            if (e.target && e.target?.files) {
              setCsvFileInventory(e.target.files[0]);
            }
          }}
        ></input>
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (csvFileInventory) submitInventory();
          }}
        >
          Submit
        </button>
        <br />
        <br />

        {csvArrayInventory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Post Link</th>
                <th>Photo</th>
                <th>Threads</th>
              </tr>
            </thead>
            <tbody>
              {csvArrayInventory.map((item, i) => (
                <tr key={i}>
                  <td>{item.number}</td>
                  <td>{item.name}</td>
                  <td>{item.owned ? 'X' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </form>

      <form id="csv-form-palette">
        <h2>Palettes</h2>
        <input
          type="file"
          accept=".csv"
          id="csvFilePalette"
          onChange={(e) => {
            if (e.target && e.target?.files) {
              setCsvFilePalettes(e.target.files[0]);
            }
          }}
        ></input>
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (csvFilePalettes) submitPalettes();
          }}
        >
          Submit
        </button>
        <br />
        <br />

        {csvArrayPalettes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Photo</th>
                <th>Link</th>
                <th colSpan={6}>Threads</th>
              </tr>
            </thead>
            <tbody>
              {csvArrayPalettes.map((item, i) => (
                <tr key={i}>
                  <td>{item.date}</td>
                  <td>
                    <img src={item.photo_link} alt="" className="palette_photo" />
                  </td>
                  <td>
                    <a href={item.post_link} target="_blank" rel="noreferrer">
                      link
                    </a>
                  </td>
                  {item.threads.map((thread, i) => (
                    <td
                      key={i}
                      className={classnames(
                        csvArrayInventory.length > 0 && !ownedThreads?.includes(thread) && 'not_owned_thread'
                      )}
                    >
                      {thread}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </form>
    </div>
  );
}
