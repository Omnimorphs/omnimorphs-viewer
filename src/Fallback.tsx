import React from 'react';
import './2dTab.css';
import TwoDImage from './2dImage';
import fetchData from './services/fetchData';
import id from './services/id';
import Loader from './Loader';

const metadataResource = fetchData(
  `https://connect.omnimorphs.com/api/v1/external/omnimorphs/${id}`
);

function TwoDTab() {
  const metadata = metadataResource.read();
  const image = metadata.image;

  return (
    <React.Suspense fallback={<Loader />}>
      <TwoDImage image={image} />
    </React.Suspense>
  );
}

export default TwoDTab;
