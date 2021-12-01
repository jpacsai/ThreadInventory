// import classnames from 'classnames';
import { Thread } from './App';

// import './CsvReader.scss';

export type InventoryProps = {
  inventory: Thread[];
};

export default function Inventory({ inventory }: InventoryProps) {
  return (
    <div className="forms">
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Owned</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, i) => (
            <tr key={i}>
              <td>{item.number}</td>
              <td>{item.name}</td>
              <td>{item.owned ? 'X' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
