import React from 'react';
import './2dTab.css';
import id from './services/id';
import wrapPromise from './services/wrapPromise';
import api from './services/api';

const metadataResource = wrapPromise(api());

function TwoDTab() {
  const metadata = metadataResource.read();
  const image = metadata.metadata.imageIpfs;

  return (
    <section className="TwoDTab__root">
      <main className="TwoDTab__main">
        <img className="TwoDTab__image" src={image} alt={`Omnimorph#${id}`} />
      </main>
    </section>
  );
}

export default TwoDTab;
