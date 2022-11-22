import './AnimationSwitch.css';
import Button from './Button';
import React from 'react';
import IdleIcon from './icons/IdleIcon';
import SaluteIcon from './icons/SaluteIcon';
import WalkIcon from './icons/WalkIcon';

export type AnimationSwitchProps = {
  activeAnimation: number;
  setActiveAnimation: (tabNumber: number) => void;
};

const icons = [
  <IdleIcon key={0} />,
  <SaluteIcon key={1} />,
  <WalkIcon key={2} />
];

function AnimationSwitch({
  activeAnimation,
  setActiveAnimation
}: AnimationSwitchProps) {
  return (
    <ul className="AnimationSwitch__root">
      {[0, 1, 2].map((tabNumber) => (
        <li key={tabNumber} className="AnimationSwitch__item">
          <Button
            onClick={() => setActiveAnimation(tabNumber)}
            active={tabNumber === activeAnimation}
          >
            {icons[tabNumber]}
          </Button>
        </li>
      ))}
    </ul>
  );
}

export default AnimationSwitch;
