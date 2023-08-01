import models, { MODEL_TYPE } from './services/models';
import VrmTabGeneral, { ModelSubTabProps } from './VrmTabGeneral';

const model = models.get(MODEL_TYPE.VOXEL);

function VoxelTab({ activeAnimation }: ModelSubTabProps) {
  return (
    <VrmTabGeneral
      activeAnimation={activeAnimation}
      model={model}
      type={MODEL_TYPE.VOXEL}
    ></VrmTabGeneral>
  );
}

export default VoxelTab;
