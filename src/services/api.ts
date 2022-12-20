import id from './id';

let cache: any;
let promiseCache: Promise<any>;

const getResp = async () => {
  let resp: any = {
    metadata: { avatarsLoaded: false, avatarsUpToDate: false }
  };

  try {
    const apiResponse = await (
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
    if (apiResponse.metadata) {
      resp = apiResponse;
      resp.metadata.avatarsLoaded = true;
    }
  } catch (e) {
    console.log(resp);
    console.log('no response from Cryptoavatars');
  }

  const respOmnimorphs = await (
    await fetch(
      'https://connect.omnimorphs.com/api/v1/external/omnimorphs/' + id
    )
  ).json();

  resp.metadata.avatarsUpToDate =
    resp.metadata.imageIpfs === respOmnimorphs.image;
  resp.metadata.imageIpfs = respOmnimorphs.image;

  return resp;
};

async function api() {
  if (cache) {
    console.log(cache);
    return cache;
  }

  if (!promiseCache) {
    promiseCache = getResp();
  }

  const resp = await promiseCache;

  cache = resp;

  console.log(resp);

  return resp;
}

export default api;
