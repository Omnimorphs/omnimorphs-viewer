import React from 'react';
import './2dTab.css';
import wrapPromise from './services/wrapPromise';
import api from './services/api';
import TwoDImage from './2dImage';

const metadataResource = wrapPromise(api());

function TwoDTab() {
  const metadata = metadataResource.read();
  const image = metadata.metadata.imageIpfs;

  return <TwoDImage image={image} />;
}

export default TwoDTab;
