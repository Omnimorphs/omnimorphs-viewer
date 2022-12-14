import './MediaSwitch.css';
import Button from './Button';
import React from 'react';
import OmnimorphsIcon from './icons/OmnimorphsIcon';
import VrmIcon from './icons/VrmIcon';
import VoxelIcon from './icons/VoxelIcon';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import classNames from 'classnames';

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
    <>
      <ul className="MediaSwitch__root">
        {[0, 1, 2].map((tabNumber) => (
          <li key={tabNumber} className="MediaSwitch__item">
            <Button
              className={classNames({
                MediaSwitch__button: true,
                'MediaSwitch__button--disabled': tabNumber === 2
              })}
              onClick={() => tabNumber < 2 && setActiveTab(tabNumber)}
              active={tabNumber === activeTab}
              id={tabNumber === 2 && 'voxel'}
              data-tooltip-content="Only in The Sandbox for now"
              data-tooltip-place="bottom"
            >
              {icons[tabNumber]}
            </Button>
          </li>
        ))}
      </ul>
      <ReactTooltip anchorId="voxel" />
    </>
  );
}

export default MediaSwitch;
