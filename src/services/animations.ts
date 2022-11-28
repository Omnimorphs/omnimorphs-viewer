import { Group } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import wrapPromise from './wrapPromise';

const animationCache: { [path: string]: Group } = {};

function animations(path: string) {
  return wrapPromise(
    new Promise<Group>((resolve) => {
      if (animationCache[path]) {
        resolve(animationCache[path]);
      } else {
        const loader = new FBXLoader();
        loader.loadAsync(path).then((fbx) => {
          // some animation has 2 clips but first clip has no tracks
          const animationOriginal = fbx.animations[0].tracks[0]
            ? fbx.animations[0]
            : fbx.animations[1];
          const trackHipPosition = animationOriginal.tracks[0];
          // Mixamo fbx scale are x100 comparing with other formats
          trackHipPosition.values.forEach((value, index, values) => {
            values[index] *= 0.01;
          });
          animationCache[path] = fbx;
          resolve(fbx);
        });
      }
    })
  );
}

export default animations;
