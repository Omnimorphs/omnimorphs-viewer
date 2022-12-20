import './Loader.css';

function Loader() {
  // eslint-disable-next-line jsx-a11y/alt-text
  return (
    <div className="Loader__root">
      <img
        className="Loader__img"
        src="/ezgif-5-5e7fc5ba21.gif"
        alt="Omnimorphs Viewer - Loader"
      />
    </div>
  );
}

export default Loader;
