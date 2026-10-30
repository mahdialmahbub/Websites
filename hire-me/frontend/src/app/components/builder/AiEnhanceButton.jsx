"use client";

import { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { buildAiRequest, readFieldValue } from "@/resume/aiContext";
import { useEnhanceTextMutation } from "@/store/api/aiApi";
import { useFormTarget } from "./formTarget";
import { Button } from "../Button";

/**
 * "Improve with AI" under a description field.
 *   section  "professionalSummary" | "workExperience" | "education" | "projects"
 *   itemId   the entry's id (list sections)        field  "jobDescription" | "description" | ...
 *
 * - text in the field  -> the AI improves it;  empty field -> the AI writes it from the information already entered
 * - the result REPLACES the text; "Undo" puts the old text back in one click (until the field is edited again)
 * - the button is disabled while the AI works; a failure shows a clear message and "Try again"
 * - the AI is called through the server only (the API key never reaches the browser)
 */
export default function AiEnhanceButton({ section, itemId, field }) {
  const dispatch = useDispatch();
  const store = useStore();
  const { stateKey, actions } = useFormTarget(); // the builder draft or the profile draft
  const { setSection, updateItem } = actions;
  const [enhance, { isLoading }] = useEnhanceTextMutation();
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [undo, setUndo] = useState(null); // { previous, applied }

  const target = { section, itemId, field };
  const current = useSelector((state) => readFieldValue(state[stateKey].content, target));

  const write = (value) =>
    dispatch(
      section === "professionalSummary"
        ? setSection({ section, value })
        : updateItem({ section, id: itemId, field, value }),
    );

  const run = async () => {
    setError("");
    setNotice("");
    const request = buildAiRequest(store.getState()[stateKey].content, target);
    if (!request) return;

    try {
      const result = await enhance(request).unwrap();

      // Typing while the AI worked: never overwrite what the person wrote in the meantime.
      const nowText = readFieldValue(store.getState()[stateKey].content, target).trim();
      if (nowText !== request.text) {
        setNotice("You changed the text while the AI was working, so it was left as you wrote it.");
        return;
      }

      const before = readFieldValue(store.getState()[stateKey].content, target); // exactly as typed (Undo restores it)
      write(result.text);
      setUndo({ previous: before, applied: result.text });
      setNotice(result.mode === "generate" ? "Written from your information. Check it and edit freely." : "Improved. Check it and edit freely.");
    } catch (err) {
      setError(err?.message || "The AI could not help right now. Please try again.");
    }
  };

  const restore = () => {
    write(undo.previous);
    setUndo(null);
    setNotice("Your previous text is back.");
  };

  // Undo is offered only while the text is still exactly what the AI wrote.
  const canUndo = undo && current === undo.applied;
  const label = isLoading ? "Working…" : error ? "Try again" : current.trim() ? "Improve with AI" : "Write with AI";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-space-2">
        {canUndo && (
          <Button type="button" variant="text" icon="fi fi-rr-undo" onClick={restore} disabled={isLoading} className="text-neutral-500 hover:text-neutral-700">
            Undo
          </Button>
        )}
        <Button
          type="button"
          variant="text"
          icon="fi fi-rr-magic-wand"
          loading={isLoading}
          disabled={isLoading}
          onClick={run}
          aria-busy={isLoading}
          className="text-orange-500 hover:text-orange-600"
        >
          {label}
        </Button>
      </div>
      <p aria-live="polite" className={`min-h-4 text-[12px] ${error ? "text-red-600" : "text-neutral-500/70"}`} role={error ? "alert" : undefined}>
        {error || notice}
      </p>
    </div>
  );
}
