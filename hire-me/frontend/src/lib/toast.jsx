"use client";

import { Slide, ToastContainer, toast as base } from "react-toastify";

/**
 * The ONLY place that talks to react-toastify. Everything else imports from here:
 *
 *   import toast, { Toaster } from "@/lib/toast";
 *
 *   <Toaster />                                      // once, in the root layout
 *   toast.success("Saved");  toast.error("Failed");  toast.warning("Check the form");  toast.info("Tip");
 *   toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Could not save" });
 *   toast.undo("Experience deleted", { onUndo: restore });
 *
 * The same names react-hot-toast had (success, error, loading, promise, custom, dismiss, remove, and the
 * `duration` / `id` options) still work, so old calls keep running after the import path is changed.
 */

const DEFAULT_DURATION = 4000;
const UNDO_DURATION = 6000;

// The design: white card, coloured icon + thin coloured progress line (yellow = warning, green = success).
// Set as inline CSS variables on the container, so they win over the library's own :root values.
// The icon / progress variables are listed again on purpose: the library resolves them on :root.
const THEME_VARS = {
  "--toastify-color-success": "#22c55e",
  "--toastify-color-warning": "#f5b301",
  "--toastify-color-error": "#ef4444",
  "--toastify-color-info": "#4f46e5",

  "--toastify-icon-color-success": "#22c55e",
  "--toastify-icon-color-warning": "#f5b301",
  "--toastify-icon-color-error": "#ef4444",
  "--toastify-icon-color-info": "#4f46e5",

  "--toastify-color-progress-success": "#22c55e",
  "--toastify-color-progress-warning": "#f5b301",
  "--toastify-color-progress-error": "#ef4444",
  "--toastify-color-progress-info": "#4f46e5",
  "--toastify-color-progress-light": "#4f46e5", // plain toast("...")
  "--toastify-color-progress-bgo": 0, // no grey track behind the progress line

  "--toastify-text-color-light": "#3f3f46",
  "--toastify-toast-width": "320px",
  "--toastify-toast-min-height": "56px",
  "--toastify-toast-padding": "14px 16px",
  "--toastify-toast-bd-radius": "6px",
  "--toastify-toast-shadow": "0 4px 14px rgba(15, 23, 42, 0.12)",
  "--toastify-font-family": "inherit",
};

/**
 * @typedef {import("react-toastify").ToastOptions & { duration?: number, id?: string | number }} ToastOptions
 * `duration` (ms, Infinity = until closed) and `id` are the react-hot-toast names for autoClose / toastId.
 */

/**
 * @typedef {Object} UndoOptions
 * @property {() => void} [onUndo] Runs when the user presses Undo
 * @property {() => void} [onExpire] Runs when the toast closes WITHOUT Undo (time is up, or the × was pressed)
 * @property {string} [label] Button text (default "Undo")
 * @property {number} [duration] How long Undo stays available, in ms (default 6000)
 * @property {"warning" | "info" | "success" | "error" | "default"} [type] Icon + progress colour (default "warning")
 */

// react-hot-toast option names -> react-toastify option names
function normalize({ duration, id, ...rest } = {}) {
  return {
    ...(duration !== undefined && { autoClose: Number.isFinite(duration) ? duration : false }),
    ...(id !== undefined && { toastId: id }),
    ...rest,
  };
}

// toast((t) => <div>…</div>) used to get `t.id`; toastify passes { closeToast, toastProps } instead
function wrap(content) {
  if (typeof content !== "function") return content;
  return (props) => content({ id: props.toastProps?.toastId, ...props });
}

const show = (type) => (message, options) => {
  const { toastId, ...rest } = normalize(options);

  // toast.success("Saved", { id }) on an open toast (e.g. a loading one) turns THAT toast into a success
  if (toastId !== undefined && base.isActive(toastId)) {
    base.update(toastId, {
      render: wrap(message),
      type,
      isLoading: false,
      autoClose: DEFAULT_DURATION,
      ...rest,
    });
    return toastId;
  }

  return base[type](wrap(message), { ...(toastId !== undefined && { toastId }), ...rest });
};

// toast.promise messages can be a string or a function of the result, same as before
const mapMessage = (message) =>
  typeof message === "function" ? { render: ({ data }) => message(data) } : message;

function UndoContent({ message, label, onUndo, closeToast }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{message}</span>
      <button
        type="button"
        onClick={() => {
          onUndo();
          closeToast();
        }}
        className="shrink-0 rounded-md px-2.5 py-1 font-semibold text-indigo-600 outline-none transition-colors hover:bg-indigo-500/10 focus-visible:ring-[3px] focus-visible:ring-indigo-300"
      >
        {label}
      </button>
    </div>
  );
}

/**
 * @param {import("react").ReactNode | ((t: { id?: string | number, closeToast: () => void }) => import("react").ReactNode)} message
 * @param {ToastOptions} [options]
 */
const toast = (message, options) => base(wrap(message), normalize(options));

toast.success = show("success");
toast.error = show("error");
toast.warning = show("warning");
toast.info = show("info");

toast.loading = (message, options) => base.loading(message, normalize(options));

toast.promise = (promise, { loading, success, error }, options) =>
  base.promise(
    promise,
    { pending: loading, success: mapMessage(success), error: mapMessage(error) },
    normalize(options),
  );

// hot-toast's toast.custom(render): your own content inside the card, without the status icon
toast.custom = (render, options) => base(wrap(render), { icon: false, ...normalize(options) });

toast.dismiss = (id) => base.dismiss(id);
toast.remove = toast.dismiss;
toast.update = base.update;
toast.isActive = base.isActive;

/**
 * Message + "Undo" button. Returns the toast id.
 * @param {import("react").ReactNode} message
 * @param {UndoOptions} [options]
 */
toast.undo = (message, options = {}) => {
  const {
    onUndo,
    onExpire,
    label = "Undo",
    duration = UNDO_DURATION,
    type = "warning",
    ...rest
  } = options;
  let undone = false;

  return base(
    ({ closeToast }) => (
      <UndoContent
        message={message}
        label={label}
        closeToast={closeToast}
        onUndo={() => {
          undone = true;
          onUndo?.();
        }}
      />
    ),
    {
      type,
      autoClose: duration,
      closeOnClick: false, // a stray click must not throw the Undo away
      onClose: () => {
        if (!undone) onExpire?.();
      },
      ...normalize(rest),
    },
  );
};

/** Render once in the root layout. Any ToastContainer prop (position, limit, …) can be passed to change a default. */
/** @param {import("react-toastify").ToastContainerProps} props */
export function Toaster(props) {
  return (
    <ToastContainer
      position="top-right"
      autoClose={DEFAULT_DURATION}
      limit={4}
      newestOnTop
      closeOnClick
      pauseOnHover
      pauseOnFocusLoss
      draggable
      theme="light"
      transition={Slide}
      style={THEME_VARS}
      toastClassName="text-[0.875rem]"
      progressStyle={{ height: "3px" }}
      {...props}
    />
  );
}

export { toast };
export default toast;
