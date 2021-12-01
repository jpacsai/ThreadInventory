import classnames from 'classnames';
import { Palette, Thread } from './App';

import './Palettes.scss';

export type PalettesProps = {
  palettes: Palette[];
  inventory: Thread[];
};

export default function Palettes({ palettes, inventory }: PalettesProps) {
  const parseThreadNumbers = (thread: string): string | number =>
    Number.isNaN(Number(thread)) ? thread : Number(thread);

  const getOwnedThreads = () => {
    if (inventory.length === 0) return;
    const owned = inventory.reduce(
      (acc: (string | number)[], item) => (item.owned ? [...acc, parseThreadNumbers(item.number)] : acc),
      []
    );
    return owned;
  };

  const ownedThreads = getOwnedThreads(); // TODO useMemo

  return (
    <div className="forms">
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
          {palettes.map((item, i) => (
            <tr key={i}>
              <td className="palette_date">{item.date}</td>
              <td>
                <img src={item.photo_link} alt="" className="palette_photo" />
              </td>
              <td className="palette_link">
                <a href={item.post_link} target="_blank" rel="noreferrer">
                  link
                </a>
              </td>
              {item.threads.map((thread, i) => (
                <td
                  key={i}
                  className={classnames(
                    'palette_thread',
                    palettes.length > 0 && !ownedThreads?.includes(thread) && 'not_owned_thread'
                  )}
                >
                  {thread}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
