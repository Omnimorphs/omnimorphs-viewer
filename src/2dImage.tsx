import React from 'react';
import './2dTab.css';
import id from './services/id';

function TwoDImage({ image }: { image: string }) {
  return (
    <section
      className="TwoDTab__root"
      style={{ backgroundImage: `url(${image})` }}
    >
      <main className="TwoDTab__main">
        <img className="TwoDTab__image" src={image} alt={`Omnimorph#${id}`} />
      </main>
    </section>
  );
}

export default TwoDImage;
