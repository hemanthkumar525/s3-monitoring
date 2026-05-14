import {
  BrainCircuit,
  Cpu,
  Radio,
  Layers3,
} from 'lucide-react';

export function BedrockModelCard({
  model,
}: any) {

  return (

    <div className="bg-[#0B1220] border border-[#1F2937] rounded-xl p-4">

      <div className="flex items-start justify-between">

        <div>

          <div className="flex items-center gap-2">

            <BrainCircuit
              size={16}
              className="text-cyan-400"
            />

            <h3 className="font-medium text-sm">
              {model.model_id}
            </h3>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            {model.provider}
          </p>
        </div>

        <ModelBadge />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">

        <StatusItem
          label="Streaming"
          value={
            model.streaming_supported
          }
          positive="Enabled"
          negative="Disabled"
        />

        <StatusItem
          label="Inference"
          value={
            model.inference_types
              ?.length > 0
          }
          positive="Available"
          negative="Unavailable"
        />

        <StatusItem
          label="Input"
          value={
            model.input_modalities
              ?.length > 0
          }
          positive={
            model.input_modalities?.join(', ')
          }
          negative="None"
        />

        <StatusItem
          label="Output"
          value={
            model.output_modalities
              ?.length > 0
          }
          positive={
            model.output_modalities?.join(', ')
          }
          negative="None"
        />
      </div>
    </div>
  );
}

function StatusItem({
  label,
  value,
  positive,
  negative,
}: any) {

  return (

    <div className="bg-[#111827] border border-[#1F2937] rounded-lg px-3 py-2">

      <div className="text-[11px] text-slate-500 uppercase tracking-wide">
        {label}
      </div>

      <div
        className={`text-sm font-medium mt-1 ${
          value
            ? 'text-cyan-400'
            : 'text-red-400'
        }`}
      >

        {value
          ? positive
          : negative}
      </div>
    </div>
  );
}

function ModelBadge() {

  return (

    <span
      className="
        px-2 py-1
        rounded-full
        text-xs
        border
        bg-cyan-500/10
        text-cyan-400
        border-cyan-500/20
      "
    >
      FOUNDATION
    </span>
  );
}