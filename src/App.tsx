// import CsvReader from './CsvReader';
import useGoogleSheets from 'use-google-sheets';

import './App.css';

function App() {
  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_API_KEY || 'nope',
    sheetId: process.env.REACT_APP_SHEETS_ID || 'nope',
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <CsvReader /> */}
        {JSON.stringify(data)}
      </header>
    </div>
  );
}

export default App;
