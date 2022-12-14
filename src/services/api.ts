import id from './id';

let cache: any;

async function api() {
  if (cache) {
    return cache;
  }

  const resp = await (
    await fetch(
      'https://api.cryptoavatars.io/v1/nfts/avatars/0xb5f3dEE204cA76E913bb3129BA0312b9f0f31D82/' +
        id,
      {
        headers: {
          'API-KEY': process.env.REACT_APP_API_KEY as any
        }
      }
    )
  ).json();

  cache = resp;

  return resp;
}

export default api;
