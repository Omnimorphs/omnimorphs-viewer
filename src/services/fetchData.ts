import wrapPromise from './wrapPromise';

function fetchData(url: string) {
  const promise = fetch(url).then((res) => res.json());

  return wrapPromise(promise);
}

export default fetchData;
