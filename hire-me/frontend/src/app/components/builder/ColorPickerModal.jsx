"use client";

import { useDispatch, useSelector } from "react-redux";
import { PALETTE, resolveColor } from "@/resume/theme/palette";
import { setDesign } from "@/store/builder/builderSlice";
import Modal from "../Modal";
import ColorSelect from "./ColorSelect";

/** The "Color" button's dialog: the shared palette. The chosen colour is saved with the resume (design.color). */
export default function ColorPickerModal({ open, onClose }) {
  const dispatch = useDispatch();
  const selected = resolveColor(useSelector((state) => state.builder.design.color));

  return (
    <Modal open={open} onClose={onClose} title="Choose a colour" className="max-w-2xl">
      <ul className="grid gap-3 ">
        {PALETTE.map(({ id, name, hex, subtitle }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => {
                dispatch(setDesign({ color: hex }));
                onClose();
              }}
              aria-pressed={hex === selected}
              className="block w-full rounded-sm text-left outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-300"
            >
              <ColorSelect color={hex} title={name} subtitle={subtitle} isActive={hex === selected} />
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
