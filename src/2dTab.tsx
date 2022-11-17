import React from 'react';
import './2dTab.css';
import fetchData from './services/fetchData';
import id from './services/id';

const metadataResource = fetchData(
  `https://connect.omnimorphs.com/api/v1/external/omnimorphs/${id}`
);

function TwoDTab() {
  const metadata = metadataResource.read();
  const image = metadata.image;

  return (
    <section className="TwoDTab__root">
      <main className="TwoDTab__main">
        <img className="TwoDTab__image" src={image} alt={`Omnimorph#${id}`} />
      </main>
    </section>
  );
}

export default TwoDTab;
