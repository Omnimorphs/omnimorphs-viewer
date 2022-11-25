import * as THREE from 'three';
import { fixSkeletonZForward } from './skeletonUtils.js';

import {
  getSkinnedMeshes,
  getSkeleton,
  // makeBoneMap,
  getTailBones,
  getModelBones
  // cloneModelBones,
  // retargetAnimation,
  // animationBoneToModelBone,
} from './util.js';

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localMatrix = new THREE.Matrix4();

//Get father bones object (Armature object)
export const _findArmature = (bone) => {
  for (; ; bone = bone.parent) {
    if (!bone.isBone) {
      return bone;
    }
  }
  return null; // can't happen
};

export function treatSkeleton(object) {
  const model = object.scene;
  model.updateMatrixWorld(true);

  const skinnedMeshes = getSkinnedMeshes(object);
  const skeleton = getSkeleton(object);
  const tailBones = getTailBones(object);
  const modelBones = getModelBones(object);

  const foundModelBones = {};
  for (const k in modelBones) {
    const v = modelBones[k];
    if (v) {
      foundModelBones[k] = v;
    }
  }

  const armature = _findArmature(modelBones.Root);
  //console.log("armature quaternion", armature.quaternion)

  const leftArmDirection = modelBones.Left_wrist.getWorldPosition(
    new THREE.Vector3()
  ).sub(modelBones.Head.getWorldPosition(new THREE.Vector3()));
  const flipZ = leftArmDirection.x < 0; //eyeDirection.z < 0;

  const armatureDirection = new THREE.Vector3(0, 1, 0).applyQuaternion(
    armature.quaternion
  );
  //console.log("armature direction", armatureDirection)
  const flipY = armatureDirection.z < -0.5;

  const legDirection = new THREE.Vector3(0, 0, -1).applyQuaternion(
    modelBones.Left_leg.getWorldQuaternion(new THREE.Quaternion()).premultiply(
      armature.quaternion.clone().invert()
    )
  );
  const flipLeg = legDirection.y < 0.5;

  const armatureQuaternion = armature.quaternion.clone();
  const armatureMatrixInverse = armature.matrixWorld.clone().invert();
  armature.position.set(0, 0, 0);
  armature.quaternion.set(0, 0, 0, 1);
  armature.scale.set(1, 1, 1);
  armature.updateMatrix();

  const preRotations = {};
  const _ensurePrerotation = (k) => {
    const boneName = modelBones[k].name;
    if (!preRotations[boneName]) {
      preRotations[boneName] = new THREE.Quaternion();
    }
    return preRotations[boneName];
  };

  if (flipY) {
    _ensurePrerotation('Hips').premultiply(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -Math.PI / 2
      )
    );
  }
  if (flipZ) {
    _ensurePrerotation('Hips').premultiply(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      )
    );
  }
  if (flipLeg) {
    ['Left_leg', 'Right_leg'].forEach((k) => {
      _ensurePrerotation(k).premultiply(
        new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          Math.PI / 2
        )
      );
    });
  }

  const _recurseBoneAttachments = (o) => {
    for (const child of o.children) {
      if (child.isBone) {
        _recurseBoneAttachments(child);
      } else {
        child.matrix
          .premultiply(
            localMatrix.compose(
              localVector.set(0, 0, 0),
              new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 1, 0),
                Math.PI
              ),
              localVector2.set(1, 1, 1)
            )
          )
          .decompose(child.position, child.quaternion, child.scale);
      }
    }
  };
  _recurseBoneAttachments(modelBones['Hips']);

  //console.log("FLIP Z:", flipZ, "FLIP Y:",flipY,"FLIP LEGS:", flipLeg);

  const qrArm = flipZ ? modelBones.Left_arm : modelBones.Right_arm;
  const qrElbow = flipZ ? modelBones.Left_elbow : modelBones.Right_elbow;
  const qrWrist = flipZ ? modelBones.Left_wrist : modelBones.Right_wrist;
  const qr = new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
    .premultiply(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
          new THREE.Vector3(0, 0, 0),
          qrElbow
            .getWorldPosition(new THREE.Vector3())
            .applyMatrix4(armatureMatrixInverse)
            .sub(
              qrArm
                .getWorldPosition(new THREE.Vector3())
                .applyMatrix4(armatureMatrixInverse)
            )
            .applyQuaternion(armatureQuaternion),
          new THREE.Vector3(0, 1, 0)
        )
      )
    );
  const qr2 = new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2)
    .premultiply(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
          new THREE.Vector3(0, 0, 0),
          qrWrist
            .getWorldPosition(new THREE.Vector3())
            .applyMatrix4(armatureMatrixInverse)
            .sub(
              qrElbow
                .getWorldPosition(new THREE.Vector3())
                .applyMatrix4(armatureMatrixInverse)
            )
            .applyQuaternion(armatureQuaternion),
          new THREE.Vector3(0, 1, 0)
        )
      )
    );
  const qlArm = flipZ ? modelBones.Right_arm : modelBones.Left_arm;
  const qlElbow = flipZ ? modelBones.Right_elbow : modelBones.Left_elbow;
  const qlWrist = flipZ ? modelBones.Right_wrist : modelBones.Left_wrist;
  const ql = new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
    .premultiply(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
          new THREE.Vector3(0, 0, 0),
          qlElbow
            .getWorldPosition(new THREE.Vector3())
            .applyMatrix4(armatureMatrixInverse)
            .sub(
              qlArm
                .getWorldPosition(new THREE.Vector3())
                .applyMatrix4(armatureMatrixInverse)
            )
            .applyQuaternion(armatureQuaternion),
          new THREE.Vector3(0, 1, 0)
        )
      )
    );
  const ql2 = new THREE.Quaternion()
    .setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2)
    .premultiply(
      new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(
          new THREE.Vector3(0, 0, 0),
          qlWrist
            .getWorldPosition(new THREE.Vector3())
            .applyMatrix4(armatureMatrixInverse)
            .sub(
              qlElbow
                .getWorldPosition(new THREE.Vector3())
                .applyMatrix4(armatureMatrixInverse)
            )
            .applyQuaternion(armatureQuaternion),
          new THREE.Vector3(0, 1, 0)
        )
      )
    );

  _ensurePrerotation('Right_arm').multiply(qr.clone().invert());
  _ensurePrerotation('Right_elbow')
    .multiply(qr.clone())
    .premultiply(qr2.clone().invert());
  _ensurePrerotation('Left_arm').multiply(ql.clone().invert());
  _ensurePrerotation('Left_elbow')
    .multiply(ql.clone())
    .premultiply(ql2.clone().invert());

  _ensurePrerotation('Left_leg').premultiply(
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -Math.PI / 2
    )
  );
  _ensurePrerotation('Right_leg').premultiply(
    new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -Math.PI / 2
    )
  );

  for (const k in preRotations) {
    preRotations[k].invert();
  }
  fixSkeletonZForward(armature.children[0], {
    preRotations
  });
  model.traverse((o) => {
    if (o.isSkinnedMesh) {
      o.bind(
        o.skeleton.bones.length === skeleton.bones.length &&
          o.skeleton.bones.every((bone, i) => bone === skeleton.bones[i])
          ? skeleton
          : o.skeleton
      );
    }
  });
  if (flipY) {
    modelBones.Hips.quaternion.premultiply(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        -Math.PI / 2
      )
    );
  }
  if (!flipZ) {
    /* ['Left_arm', 'Right_arm'].forEach((name, i) => {
            const bone = modelBones[name];
            if (bone) {
              bone.quaternion.premultiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), (i === 0 ? 1 : -1) * Math.PI*0.25));
            }
          }); */
  } else {
    modelBones.Hips.quaternion.premultiply(
      new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        Math.PI
      )
    );
  }
  modelBones.Right_arm.quaternion.premultiply(qr.clone().invert());
  modelBones.Right_elbow.quaternion
    .premultiply(qr)
    .premultiply(qr2.clone().invert());
  modelBones.Left_arm.quaternion.premultiply(ql.clone().invert());
  modelBones.Left_elbow.quaternion
    .premultiply(ql)
    .premultiply(ql2.clone().invert());
  model.updateMatrixWorld(true);

  modelBones.Root.traverse((bone) => {
    bone.initialQuaternion = bone.quaternion.clone();
  });

  return {
    skinnedMeshes,
    skeleton,
    modelBones,
    foundModelBones,
    flipZ,
    flipY,
    flipLeg,
    tailBones,
    armature,
    armatureQuaternion,
    armatureMatrixInverse
    // retargetedAnimations,
  };
}
