import Button from './Button';
import ExclamationIcon from './icons/ExclamationIcon';
import './Notice.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import React from 'react';

function Notice({ message }: { message: string }) {
  return (
    <>
      <Button
        id="notice"
        className="Notice__root Button__root--disabled"
        data-tooltip-content={message}
        data-tooltip-place="bottom"
      >
        {<ExclamationIcon />}
      </Button>
      <ReactTooltip anchorId="notice" />
    </>
  );
}

export default Notice;
