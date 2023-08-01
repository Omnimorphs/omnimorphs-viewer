import './MediaSwitch.css';
import Button from './Button';
import React from 'react';
import OmnimorphsIcon from './icons/OmnimorphsIcon';
import VrmIcon from './icons/VrmIcon';
import VoxelIcon from './icons/VoxelIcon';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import classNames from 'classnames';
import wrapPromise from './services/wrapPromise';
import api from './services/api';

export type MediaSwitchProps = {
  activeTab: number;
  setActiveTab: (tabNumber: number) => void;
};

const icons = [
  <OmnimorphsIcon key={0} />,
  <VrmIcon key={1} />,
  <VoxelIcon key={2} />
];

const ids = ['2d', 'vrm', 'voxel'];
const texts = [
  'Original Artwork',
  'VR-Ready Avatar',
  'Voxel Avatar - Available in The Sandbox'
];

const metadataResource = wrapPromise(api());

function MediaSwitch({ activeTab, setActiveTab }: MediaSwitchProps) {
  const metadata = metadataResource.read();
  return (
    <>
      {metadata.metadata.avatarsLoaded ? (
        <>
          <ul className="MediaSwitch__root">
            {[0, 1, 2].map((tabNumber) => (
              <li key={tabNumber} className="MediaSwitch__item">
                <Button
                  className={classNames({
                    MediaSwitch__button: true
                  })}
                  onClick={() => setActiveTab(tabNumber)}
                  active={tabNumber === activeTab}
                  id={ids[tabNumber]}
                  data-tooltip-content={texts[tabNumber]}
                  data-tooltip-place="bottom"
                >
                  {icons[tabNumber]}
                </Button>
              </li>
            ))}
          </ul>
          <ReactTooltip anchorId="voxel" />
          <ReactTooltip anchorId="vrm" />
          <ReactTooltip anchorId="2d" />
        </>
      ) : null}
    </>
  );
}

export default MediaSwitch;
