"use client";

import { useId, useState } from "react";
import toast from "@/lib/toast";
import { isEntryEmpty } from "@/resume/validation";
import { useFormTarget } from "./formTarget";
import { Button } from "../Button";
import EntryCardHeader from "./EntryCardHeader";
import { ENTRY_CONFIG, DEFAULT_ENTRY, getEntrySummary } from "./entryConfig";

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

// Entry r kono field e error thakle true. errors er key: "<entryId>.<field>"
const hasEntryError = (errors, id) =>
  Object.keys(errors ?? {}).some(
    (key) => key.startsWith(`${id}.`) && errors[key],
  );

// List e notun kono value ashle (notun entry add, undo, notun error) `onNew` call kore.
// Render er shomoy-i state update kora hoy, tai effect er dorkar nei.
function useOnNew(list, onNew) {
  const [known, setKnown] = useState(list);
  const changed =
    list.length !== known.length || list.some((value, i) => value !== known[i]);

  if (changed) {
    setKnown(list);
    const fresh = list.filter((value) => !known.includes(value));
    if (fresh.length > 0) onNew(fresh);
  }
}

/* -------------------------------------------------------------------------- */
/*  EntryList                                                                  */
/*                                                                             */
/*  <EntryList section="education" items={items} max={5} ... />                */
/*  Card er header e ki dekhabe seta entryConfig.js e thake.                   */
/* -------------------------------------------------------------------------- */

/**
 * @typedef {Object} EntryListProps
 * @property {import("./entryConfig").EntrySection} section - Builder state er section id, e.g. "workExperience"
 * @property {string} [label] - Singular naam, na dile entryConfig er label use hoy ("Job deleted", "Add job")
 * @property {{ id: string }[]} items - Ei section er entry gulo
 * @property {number} max - Maximum koyta entry deya jabe
 * @property {import("react").Dispatch<any>} dispatch - Redux dispatch
 * @property {Record<string, any>} [errors] - useSection er errors object. Card e error thakle header e "Fix errors" dekhay ar card nijei khule jay
 * @property {string} [sectionError] - Puro section er error text (card er niche dekhabe)
 * @property {(item: any, index: number) => import("react").ReactNode} renderEntry - Ekta entry r form
 */

/**
 * Repeatable section (job, education, project, reference): prottek entry ekta collapsible card,
 * header e summary + move up / down + delete, ar niche "Add More" button.
 * Ekta entry r form `renderEntry(item, index)` diye pass kora hoy.
 *
 * Ekbar-e shudhu ekta card khola thake (accordion): ekta khulle ager ta nijei bondho hoy.
 * Kon card nijei khole:
 *  - page load e: error thaka entry, na thakle khali (kichu lekha hoy nai) entry
 *  - notun add kora ba undo kora entry
 *  - jei entry te notun error ashe
 * Baki gulo header click korle khole.
 *
 * Delete: entry shathe shathe chole jay ar "Undo" toast ashe. Undo korle same jaygay ferot ashe.
 * Kichu na lekha entry chup-chap delete hoy (ferot anar kichu nei).
 *
 * @param {EntryListProps} props
 */
export default function EntryList({
  section,
  label,
  items,
  max,
  dispatch,
  errors,
  sectionError,
  renderEntry,
}) {
  const { actions } = useFormTarget();
  const { addItem, moveItem, removeItem, restoreItem } = actions;
  const baseId = useId();

  const config = ENTRY_CONFIG[section] ?? DEFAULT_ENTRY;
  if (!ENTRY_CONFIG[section] && process.env.NODE_ENV !== "production") {
    console.warn(
      `[EntryList] Unknown section "${section}". Use one of: ${Object.keys(ENTRY_CONFIG).join(", ")}`,
    );
  }

  const entryLabel = label ?? config.label;
  const title = entryLabel.charAt(0).toUpperCase() + entryLabel.slice(1);
  const atMax = items.length >= max;

  /* ---- open / close ---- */
  const ids = items.map((item) => item.id);
  const errorIds = items
    .filter((item) => hasEntryError(errors, item.id))
    .map((item) => item.id);

  // Ekbar-e shudhu ekta card khola thake (accordion). null mane shob bondho.
  // Shuru te: error thaka entry, na thakle khali entry, na thakle shob bondho.
  const [openId, setOpenId] = useState(() => {
    const target =
      items.find((item) => hasEntryError(errors, item.id)) ??
      items.find((item) => isEntryEmpty(item));
    return target?.id ?? null;
  });

  // Notun / undo kora entry khule jabe, ar ager khola card bondho hobe
  useOnNew(ids, (fresh) => setOpenId(fresh[fresh.length - 1]));

  // Notun error ashle sei card khule jabe. Kintu ekhon jei card e kaj korchen
  // tate-i error thakle seta-i khola thakbe.
  useOnNew(errorIds, (fresh) =>
    setOpenId((current) => (errorIds.includes(current) ? current : fresh[0])),
  );

  // Ekta card khulle ager ta nijei bondho hoy. Khola card e click korle bondho hoy.
  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  /* ---- delete + undo ---- */
  const remove = (item, index) => {
    dispatch(removeItem({ section, id: item.id }));

    // Kichu lekha hoy nai -> ferot anar kichu nei, tai toast nai
    if (isEntryEmpty(item)) return;

    // `item` ar `index` ei closure e thake, tai onno step e gelew Undo kaj kore
    toast.undo(`${title} deleted`, {
      onUndo: () => dispatch(restoreItem({ section, item, index, max })),
    });
  };

  return (
    <div className="flex flex-col gap-space-7">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const hasError = errorIds.includes(item.id);
        const contentId = `${baseId}-${item.id}`;
        const summary = getEntrySummary(config, item);

        let borderClass = "border-neutral-500/10 hover:border-violet-500/25";
        if (isOpen) borderClass = "border-violet-500/25";
        if (hasError) borderClass = "border-red-500/30";

        return (
          <div
            key={item.id}
            className={`rounded-xl max-sm:rounded-md border bg-white transition-colors duration-200 ${borderClass}`}
          >
            <EntryCardHeader
              index={index}
              label={entryLabel}
              icon={config.icon}
              title={summary.title}
              subtitle={summary.subtitle}
              meta={summary.meta}
              badge={summary.badge}
              isOpen={isOpen}
              hasError={hasError}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              contentId={contentId}
              onToggle={() => toggle(item.id)}
              onMoveUp={() =>
                dispatch(moveItem({ section, id: item.id, direction: -1 }))
              }
              onMoveDown={() =>
                dispatch(moveItem({ section, id: item.id, direction: 1 }))
              }
              onRemove={() => remove(item, index)}
            />

            {/* form — smooth collapse. Bondho thakle `invisible`, tai input gulo keyboard focus pay na,
                kintu mounted thake, tai lekha data hariye jay na */}
            <div
              id={contentId}
              className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ease-in-out motion-reduce:transition-none ${
                isOpen
                  ? "visible grid-rows-[1fr] opacity-100"
                  : "invisible grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-space-8 border-t border-neutral-500/10 p-3 pt-4 sm:p-4 sm:pt-5">
                  {renderEntry(item, index)}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-neutral-500/20 p-6 text-center text-neutral-500/70">
          No {entryLabel} added yet. Press the button below to add one.
        </p>
      )}

      {sectionError && (
        <p role="alert" className="text-small text-red-600">
          {sectionError}
        </p>
      )}

      <Button
        variant="secondary"
        type="button"
        icon="fi fi-rr-plus-small"
        disabled={atMax}
        onClick={() => dispatch(addItem({ section }))}
        className="bg-green-500/5 text-green-500 hover:bg-green-500/10 w-full"
      >
        {items.length === 0
          ? `Add ${entryLabel}`
          : atMax
            ? `Limit reached (${max})`
            : "Add More"}
      </Button>
    </div>
  );
}
