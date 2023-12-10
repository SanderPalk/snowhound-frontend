import './App.css';
import AddMovie from "./views/Film/AddMovie";
import MovieTable from "./views/Film/MovieTable";
import {useState} from "react";

function App() {
  const [activeView, setActiveView] = useState('list')

  function handleListViewButton() {
    setActiveView('list')
  }

  function handleAddViewButton() {
    setActiveView('add')
  }

  return (
      <div className="App">
        <div className="main bg-light mt-4 m-auto p-5 rounded-5">
          <header>
            <h1>MOVIES FOR SNOWHOUND</h1>
            <nav className="w-100 d-flex flex-row justify-content-center">
              <button className={`m-1 btn btn-lg btn-light ${activeView === 'list' ? 'active': ''}`} onClick={handleListViewButton}>List of movies</button>
              <button className={`m-1 btn btn-lg btn-light ${activeView === 'add' ? 'active': ''}`} onClick={handleAddViewButton}>Add new movie</button>
            </nav>
          </header>

          <div>
            {activeView === 'list' && (
                <div>
                  <MovieTable></MovieTable>
                </div>)}
            {activeView === 'add' && (
                <div>
                  <AddMovie></AddMovie>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default App;