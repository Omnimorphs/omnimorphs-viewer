import React, { useState } from 'react';
import './App.css';
import Button from './Button';

const TwoDTab = React.lazy(
  () => /* webpackChunkName: 2dTab */ import('./2dTab')
);

const VrmTab = React.lazy(
  () => /* webpackChunkName: VrmTab */ import('./VrmTab')
);

const VoxelTab = React.lazy(
  () => /* webpackChunkName: VoxelTab */ import('./VoxelTab')
);

function App() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="App">
      <ul className="App__switch">
        {[0, 1, 2].map((tabNumber) => (
          <li key={tabNumber} className="App__switchItem">
            <Button
              onClick={() => setActiveTab(tabNumber)}
              active={tabNumber === activeTab}
            />
          </li>
        ))}
      </ul>
      <React.Suspense fallback="Loading...">
        {activeTab === 0 && <TwoDTab />}
        {activeTab === 1 && <VrmTab />}
        {activeTab === 2 && <VoxelTab />}
      </React.Suspense>
    </div>
  );
}

export default App;
