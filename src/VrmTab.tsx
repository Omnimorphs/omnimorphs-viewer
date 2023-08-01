import models, { MODEL_TYPE } from './services/models';
import VrmTabGeneral, { ModelSubTabProps } from './VrmTabGeneral';

const model = models.get(MODEL_TYPE.VRM);

function VoxelTab({ activeAnimation }: ModelSubTabProps) {
  return (
    <VrmTabGeneral
      activeAnimation={activeAnimation}
      model={model}
      type={MODEL_TYPE.VRM}
    ></VrmTabGeneral>
  );
}

export default VoxelTab;
