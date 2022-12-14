import React, { useState } from 'react';
import './App.css';
import MediaSwitch from './MediaSwitch';
import AnimationSwitch from './AnimationSwitch';
import Loader from './Loader';

const TwoDTab = React.lazy(
  () => /* webpackChunkName: 2dTab */ import('./2dTab')
);

const VrmTab = React.lazy(
  () => /* webpackChunkName: VrmTab */ import('./VrmTab')
);

// const VoxelTab = React.lazy(
//   () => /* webpackChunkName: VoxelTab */ import('./VoxelTab')
// );

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeAnimation, setActiveAnimation] = useState(0);

  return (
    <div className="App">
      <MediaSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab > 0 && (
        <AnimationSwitch
          activeAnimation={activeAnimation}
          setActiveAnimation={setActiveAnimation}
        />
      )}
      <React.Suspense fallback={<Loader />}>
        {activeTab === 0 && <TwoDTab />}
        {activeTab === 1 && <VrmTab activeAnimation={activeAnimation} />}
        {/*{activeTab === 2 && <VoxelTab activeAnimation={activeAnimation} />}*/}
      </React.Suspense>
    </div>
  );
}

export default App;
