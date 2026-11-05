"use client";

import { useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { buildAiRequest, readFieldValue } from "@/resume/aiContext";
import { useEnhanceTextMutation } from "@/store/api/aiApi";
import { useFormTarget } from "./formTarget";
import { Button } from "../Button";

/**
 * onMessage?: ({ type: "error" | "notice", text: string } | null) => void
 * Parent e message pathate chaile dao. Na dile nicher message component nijei dekhabe.
 */
export default function AiEnhanceButton({ section, itemId, field, onMessage }) {
  const dispatch = useDispatch();
  const store = useStore();
  const { stateKey, actions } = useFormTarget();
  const { setSection, updateItem } = actions;
  const [enhance, { isLoading }] = useEnhanceTextMutation();
  const [message, setMessage] = useState(null); // { type, text } | null
  const [undo, setUndo] = useState(null); // { previous, applied }

  const target = { section, itemId, field };
  const current = useSelector((state) =>
    readFieldValue(state[stateKey].content, target),
  );

  // local state + parent, duitai ekshathe update kore
  const show = (type, text) => {
    const next = text ? { type, text } : null;
    setMessage(next);
    onMessage?.(next);
  };

  const write = (value) =>
    dispatch(
      section === "professionalSummary"
        ? setSection({ section, value })
        : updateItem({ section, id: itemId, field, value }),
    );

  const run = async () => {
    show(null, "");
    const request = buildAiRequest(store.getState()[stateKey].content, target);
    if (!request) {
      show(
        "notice",
        "There is nothing for the AI to work with yet. Add some details first.",
      );
      return;
    }

    try {
      const result = await enhance(request).unwrap();

      // AI kaj korar somoy user type korle overwrite korbe na
      const nowText = readFieldValue(
        store.getState()[stateKey].content,
        target,
      ).trim();
      if (nowText !== request.text) {
        show(
          "notice",
          "You changed the text while the AI was working, so it was left as you wrote it.",
        );
        return;
      }

      const before = readFieldValue(store.getState()[stateKey].content, target);
      write(result.text);
      setUndo({ previous: before, applied: result.text });
      show(
        "notice",
        result.mode === "generate"
          ? "Written from your information. Check it and edit freely."
          : "Improved. Check it and edit freely.",
      );
    } catch (err) {
      console.log("enhance error:", err);
      show(
        "error",
        err?.data?.message ||
          err?.data?.error ||
          err?.message ||
          "The AI could not help right now. Please try again.",
      );
    }
  };

  const restore = () => {
    write(undo.previous);
    setUndo(null);
    show("notice", "Your previous text is back.");
  };

  const canUndo = undo && current === undo.applied;
  const label = isLoading
    ? "Working…"
    : message?.type === "error"
      ? "Try again"
      : current.trim()
        ? "Improve with AI"
        : "Write with AI";

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-space-4">
        {canUndo && (
          <Button
            type="button"
            variant="text"
            icon="fi fi-rr-undo"
            onClick={restore}
            disabled={isLoading}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <span className="hidden sm:inline">Undo</span>
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
          <span>{label}</span>
        </Button>
      </div>

      {/* parent onMessage dile ekhane kichu dekhabe na, parent dekhabe */}
      {!onMessage && message && <AiMessage message={message} />}
    </div>
  );
}

// parent o eta import kore use korte pare
export function AiMessage({ message }) {
  if (!message) return null;
  const isError = message.type === "error";
  return (
    <p
      role={isError ? "alert" : "status"}
      className={`text-right text-sm ${isError ? "text-red-600" : "text-neutral-500"}`}
    >
      {message.text}
    </p>
  );
}
