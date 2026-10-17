'use client';

import { useDispatch, useSelector } from 'react-redux';
import { PALETTE, resolveColor } from '@/resume/theme/palette';
import { setDesign } from '@/store/builder/builderSlice';

/**
 * The shared colour palette (resume/theme/palette.js). Picking a colour saves it in the draft (design.color);
 * the live preview, the PDF and the shared link all read that one value.
 * Drop it anywhere (e.g. inside your "Color" popover). To use your own ColorSelect, loop over PALETTE and call
 * dispatch(setDesign({ color: hex })).
 */
export default function ColorPalettePicker() {
  const dispatch = useDispatch();
  const selected = resolveColor(useSelector((state) => state.builder.design.color));

  return (
    <div role="radiogroup" aria-label="Resume colour" className="flex flex-wrap gap-3">
      {PALETTE.map(({ id, name, hex }) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={hex === selected}
          aria-label={name}
          title={name}
          style={{ backgroundColor: hex }}
          onClick={() => dispatch(setDesign({ color: hex }))}
          className="flex size-9 items-center justify-center rounded-full ring-offset-2 transition hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-500 aria-checked:ring-2 aria-checked:ring-neutral-500"
        >
          {hex === selected ? <i className="fi fi-rr-check text-white" aria-hidden="true" /> : null}
        </button>
      ))}
    </div>
  );
}
