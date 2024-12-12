import React from 'react';
import TeamProjectActivityTracker from './TeamProjectActivityTracker';

function App() {
  return (
    <div className="App">
      <TeamProjectActivityTracker configFile="/projects.yml" />
    </div>
  );
}

export default App;
