import wrapPromise from './wrapPromise';

export enum MODEL_TYPE {
  VOXEL,
  VRM
}

function modelPaths() {
  // TODO memoize API response
  const get = (type: MODEL_TYPE) => {
    return wrapPromise(
      new Promise<string>((resolve) => {
        if (type === MODEL_TYPE.VRM) {
          resolve('/Omnimorph_448.vrm');
        } else {
          resolve('/Omnimorph_00448.gltf');
        }
      })
    );
  };

  return { get };
}

export default modelPaths();
