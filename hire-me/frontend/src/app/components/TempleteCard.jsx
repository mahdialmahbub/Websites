'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './Button';
import { BUILDER_PATH } from '@/lib/returnTo';
import { setDesign } from '@/store/builder/builderSlice';
import TemplatePreview from './builder/TemplatePreview';
import { icons } from '../../../assets/iconCollection';

/**
 * Props:
 *  - template  : { id, name, category, description } (registry theke)
 *  - onPreview : optional, dile preview icon button dekhabe
 */
const TempleteCard = ({ template, onPreview }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const activeId = useSelector((state) => state.builder.design.templateId);
  const color = useSelector((state) => state.builder.design.color);

  const isActive = activeId === template.id;

  const handleUse = () => {
    dispatch(setDesign({ templateId: template.id })); // resume er sathe save hobe (design.templateId)
    router.push(BUILDER_PATH);
  };

  return (
    <div
      className={`rounded-[clamp(0.625rem,calc(0.727vw+0.455rem),1rem)] w-[clamp(13.125rem,calc(4.242vw+12.131rem),15.3125rem)] group aspect-210/297 overflow-hidden border relative ${
        isActive ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-neutral-500/10'
      }`}
    >
      {/* Live preview */}
      <div className="h-full w-full">
        <TemplatePreview templateId={template.id} color={color} />
      </div>

      {/* Category tag */}
      <span className="absolute bg-violet-900/60 text-violet-50 backdrop-blur-xs rounded-sm sm:rounded-lg py-space-2 px-space-3 top-2.5 right-2.5 font-primary font-semibold text-[12px] z-10">
        {template.category}
      </span>

      {/* Details */}
      <div className="p-[8px] rounded-lg shadow-[0_0_4px_rgba(0,0,0,1)] bg-linear-to-b to-black from-black/50 text-neutral-50 z-10 absolute bottom-2 left-2 right-2">
        <h4 className="font-primary font-semibold text-[clamp(0.875rem,calc(0.242vw+0.818rem),1rem)] mb-space-1">
          {template.name}
        </h4>
        <p className="text-[12px] opacity-80 mb-space-3 line-clamp-2 w-full">
          {template.description}
        </p>
        <div className="flex items-center gap-2.5">
          {onPreview && (
            <Button
              variant="secondary"
              className="bg-blue-500/5 hover:bg-blue-500/20 text-blue-500 border-blue-500/5"
              icon={icons.preview}
              aria-label="Preview template"
              onClick={() => onPreview(template)}
            />
          )}
          <Button
            variant="text"
            onClick={handleUse}
            className={`flex-1 ${
              isActive
                ? 'bg-green-500/10 text-green-500'
                : 'hover:bg-green-500/20 text-green-500 hover:text-green-500'
            }`}
          >
            {isActive ? 'Selected' : 'Use This'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TempleteCard;