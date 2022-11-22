import './MediaSwitch.css';
import Button from './Button';
import React from 'react';
import OmnimorphsIcon from './icons/OmnimorphsIcon';
import VrmIcon from './icons/VrmIcon';
import VoxelIcon from './icons/VoxelIcon';

export type MediaSwitchProps = {
  activeTab: number;
  setActiveTab: (tabNumber: number) => void;
};

const icons = [
  <OmnimorphsIcon key={0} />,
  <VrmIcon key={1} />,
  <VoxelIcon key={2} />
];

function MediaSwitch({ activeTab, setActiveTab }: MediaSwitchProps) {
  return (
    <ul className="MediaSwitch__root">
      {[0, 1, 2].map((tabNumber) => (
        <li key={tabNumber} className="MediaSwitch__item">
          <Button
            className="MediaSwitch__button"
            onClick={() => setActiveTab(tabNumber)}
            active={tabNumber === activeTab}
          >
            {icons[tabNumber]}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default MediaSwitch;
