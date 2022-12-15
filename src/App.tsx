import React, { useState } from 'react';
import './App.css';
import 'react-tooltip/dist/react-tooltip.css';
import MediaSwitch from './MediaSwitch';
import AnimationSwitch from './AnimationSwitch';
import Loader from './Loader';
import { ErrorBoundary } from 'react-error-boundary';
import Fallback from './Fallback';

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
      <ErrorBoundary fallback={<Fallback />}>
        <MediaSwitch activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab > 3 && (
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
      </ErrorBoundary>
    </div>
  );
}

export default App;
