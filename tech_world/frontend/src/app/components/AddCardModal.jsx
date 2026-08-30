/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  useRequestAddCardMutation,
  useConfirmAddCardMutation,
  useUpdateCardMutation,
} from "@/redux";
import useLockBodyScroll from "@/app/hooks/useLockBodyScroll";
import Button from "./Button";
import VerificationOTPModal from "./VerificationOTPModal";

/* ---------------------------------------------------
   Card network config — grouping + cvv length per type.
   BIN ranges here are simplified for UX detection only,
   not meant as strict payment-grade validation.
---------------------------------------------------- */
const CARD_TYPES = {
  visa: {
    name: "Visa",
    cvvLength: 3,
    gaps: [4, 4, 4, 4],
    color: "#5B9BFF",
    bg: "rgba(91,155,255,0.15)",
  },
  mastercard: {
    name: "Mastercard",
    cvvLength: 3,
    gaps: [4, 4, 4, 4],
    color: "#FFA940",
    bg: "rgba(255,169,64,0.15)",
  },
  amex: {
    name: "Amex",
    cvvLength: 4,
    gaps: [4, 6, 5],
    color: "#5AC8FA",
    bg: "rgba(90,200,250,0.15)",
  },
  discover: {
    name: "Discover",
    cvvLength: 3,
    gaps: [4, 4, 4, 4],
    color: "#FF7A45",
    bg: "rgba(255,122,69,0.15)",
  },
  unknown: {
    name: null,
    cvvLength: 3,
    gaps: [4, 4, 4, 4],
    color: "#64748B",
    bg: "transparent",
  },
};

function detectCardType(digits) {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits))
    return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (
    /^6011/.test(digits) ||
    /^65/.test(digits) ||
    /^64[4-9]/.test(digits) ||
    /^622/.test(digits)
  )
    return "discover";
  return "unknown";
}

function formatGroups(digits, gaps) {
  const groups = [];
  let idx = 0;
  for (const g of gaps) {
    if (idx >= digits.length) break;
    groups.push(digits.slice(idx, idx + g));
    idx += g;
  }
  return groups.join(" ");
}

function alignDigitsOnDelete({
  rawValue,
  prevDigits,
  prevDisplayValue,
  maxLength,
}) {
  let digits = rawValue.replace(/\D/g, "").slice(0, maxLength);
  const deleting = rawValue.length < prevDisplayValue.length;
  if (deleting && digits.length === prevDigits.length && digits.length > 0) {
    digits = digits.slice(0, -1);
  }
  return digits;
}

function CardBrandBadge({ type }) {
  const info = CARD_TYPES[type];
  if (!info?.name) return null;
  return (
    <span
      className="px-2 py-0.75 rounded-md text-size-small font-bold tracking-wider shrink-0"
      style={{ backgroundColor: info.bg, color: info.color }}
    >
      {info.name.toUpperCase()}
    </span>
  );
}

const emptyBilling = {
  apartmentNumber: "",
  buildingNumber: "",
  roadNumber: "",
  locality: "",
  area: "",
  city: "",
  postCode: "",
  country: "",
};

const BILLING_FIELDS = [
  ["apartmentNumber", "Apt. No."],
  ["buildingNumber", "Building No."],
  ["roadNumber", "Road No."],
  ["locality", "Locality"],
  ["area", "Area"],
  ["city", "City"],
  ["postCode", "Post Code"],
  ["country", "Country"],
];

// Shared classes for the icon+input field pattern used across this form.
const fieldIconClass =
  "text-size-h6 text-[#2BE7C4]/70 absolute left-3.5 top-1/2 -translate-y-1/2";
const fieldInputClass =
  "pl-10 pr-4 border rounded-xl transition-colors w-full bg-background text-foreground placeholder-placeholder_3 outline-none text-sm py-3 border-secondary/20 hover:border-secondary/50 focus-within:border-secondary/80";

/**
 * Props:
 *   onClose      — closes the modal
 *   editingCard  — pass an existing card to edit its name/expiry/billing
 *                  address only (card number & CVV are never stored, so
 *                  they're not editable — add a new card instead).
 *                  Omit to add a brand-new card.
 */
export default function AddCardModal({ onClose, editingCard }) {
  useLockBodyScroll();
  const isEditMode = !!editingCard;

  const [cardholderName, setCardholderName] = useState(
    editingCard?.cardHolderName || "",
  );
  const [cardDigits, setCardDigits] = useState(""); // add-mode only
  const [expiryDigits, setExpiryDigits] = useState(
    editingCard
      ? `${editingCard.expiryMonth}${String(editingCard.expiryYear).slice(-2)}`
      : "",
  );
  const [cvvValues, setCvvValues] = useState(["", "", ""]); // add-mode only
  const [billingAddress, setBillingAddress] = useState(
    editingCard?.billingAddress || emptyBilling,
  );
  const [step, setStep] = useState("form"); // "form" -> "otp" (add mode only)

  const [requestAddCard, { isLoading: requesting }] =
    useRequestAddCardMutation();
  const [confirmAddCard, { isLoading: confirming }] =
    useConfirmAddCardMutation();
  const [updateCard, { isLoading: updating }] = useUpdateCardMutation();

  // Close on Escape, matching every other modal in the app.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const cardType = useMemo(() => detectCardType(cardDigits), [cardDigits]);
  const cardInfo = CARD_TYPES[cardType];
  const cardDisplay = formatGroups(cardDigits, cardInfo.gaps);
  const cardMaxDigits = cardInfo.gaps.reduce((a, b) => a + b, 0);
  const cardMaxDisplayLength = cardMaxDigits + cardInfo.gaps.length - 1;

  const expiryDisplay =
    expiryDigits.length > 2
      ? `${expiryDigits.slice(0, 2)}/${expiryDigits.slice(2)}`
      : expiryDigits;

  const cvvLength = cardInfo.cvvLength;
  const cvvRefs = useRef([]);

  useEffect(() => {
    if (isEditMode) return; // no CVV in edit mode
    setCvvValues((prev) => {
      if (prev.length === cvvLength) return prev;
      const next = Array(cvvLength).fill("");
      for (let i = 0; i < Math.min(prev.length, cvvLength); i++)
        next[i] = prev[i];
      return next;
    });
  }, [cvvLength, isEditMode]);

  function handleCardNumberChange(e) {
    const digits = alignDigitsOnDelete({
      rawValue: e.target.value,
      prevDigits: cardDigits,
      prevDisplayValue: cardDisplay,
      maxLength: cardMaxDigits,
    });
    setCardDigits(digits);
  }

  function handleExpiryChange(e) {
    let digits = alignDigitsOnDelete({
      rawValue: e.target.value,
      prevDigits: expiryDigits,
      prevDisplayValue: expiryDisplay,
      maxLength: 4,
    });
    if (digits.length === 1 && Number(digits) > 1) digits = "0" + digits;
    if (digits.length >= 2) {
      let mm = digits.slice(0, 2);
      if (mm === "00") mm = "01";
      if (Number(mm) > 12) mm = "12";
      digits = mm + digits.slice(2);
    }
    setExpiryDigits(digits);
  }

  function focusCvv(index) {
    cvvRefs.current[index]?.focus();
  }

  function handleCvvChange(index, e) {
    const digitsOnly = e.target.value.replace(/\D/g, "");
    const char = digitsOnly.slice(-1);
    setCvvValues((prev) => {
      const next = [...prev];
      next[index] = char || "";
      return next;
    });
    if (char && index < cvvLength - 1) focusCvv(index + 1);
  }

  function handleCvvKeyDown(index, e) {
    if (e.key === "Backspace") {
      if (!cvvValues[index] && index > 0) {
        e.preventDefault();
        setCvvValues((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusCvv(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusCvv(index - 1);
    } else if (e.key === "ArrowRight" && index < cvvLength - 1) {
      e.preventDefault();
      focusCvv(index + 1);
    }
  }

  function handleCvvPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, cvvLength);
    if (!pasted) return;
    const next = Array(cvvLength).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setCvvValues(next);
    focusCvv(Math.min(pasted.length, cvvLength - 1));
  }

  const handleBillingChange = (field) => (e) =>
    setBillingAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const isCardComplete = isEditMode || cardDigits.length === cardMaxDigits;
  const isExpiryComplete = expiryDigits.length === 4;
  const isCvvComplete = isEditMode || cvvValues.every((v) => v !== "");
  const isBillingComplete =
    billingAddress.city.trim().length > 0 &&
    billingAddress.country.trim().length > 0;
  const canSubmit =
    cardholderName.trim().length > 1 &&
    isCardComplete &&
    isExpiryComplete &&
    isCvvComplete &&
    isBillingComplete;

  const handleSaveEdit = async () => {
    try {
      await updateCard({
        cardId: editingCard._id,
        cardHolderName: cardholderName,
        expiryMonth: expiryDigits.slice(0, 2),
        expiryYear: "20" + expiryDigits.slice(2),
        billingAddress,
      }).unwrap();
      toast.success("Card updated");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Could not update card");
    }
  };

  const handleRequestAdd = async () => {
    try {
      await requestAddCard({
        cardNumber: cardDigits,
        cardHolderName: cardholderName,
        expiryMonth: expiryDigits.slice(0, 2),
        expiryYear: "20" + expiryDigits.slice(2),
        cvv: cvvValues.join(""),
        billingAddress,
      }).unwrap();
      setStep("otp");
    } catch (err) {
      toast.error(err?.data?.message || "Could not verify card details");
    }
  };

  const handleVerifyOtp = async (otpCode) => {
    try {
      await confirmAddCard(otpCode).unwrap();
      toast.success("Card added");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  const handlePrimaryAction = () =>
    isEditMode ? handleSaveEdit() : handleRequestAdd();
  const isSubmitting = requesting || updating;

  // ---------- OTP step (add mode only) ----------
  if (step === "otp") {
    return (
      <VerificationOTPModal
        title="Confirm this card"
        description="We emailed a verification code to confirm you own this card."
        length={6}
        onClose={onClose}
        onSubmit={handleVerifyOtp}
        onVerified={onClose}
        footerNote="Your card details are secure and encrypted."
      />
    );
  }

  // ---------- Main form ----------
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="my-8 w-full max-w-150 space-y-space-7 rounded-2xl border-2 border-secondary/10 bg-background p-space-7"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-space-4">
          <div className="flex min-w-0 items-center gap-space-3">
            <i className="fi fi-rr-credit-card shrink-0 text-[24px] text-secondary" />
            <h2 className="truncate font-semibold text-size-h4 text-placeholder_3">
              {isEditMode ? "Edit Card Information" : "Add Card Information"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20"
          >
            <i className="fi fi-rr-cross-small" />
          </button>
        </div>

        <div className="-mr-1 max-h-[65vh] space-y-space-7 overflow-y-auto pr-1 custom-scrollbar">
          {/* cardholder name */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="px-space-1 font-primary text-size-large font-semibold text-foreground">
                Cardholder Name
              </label>
              <span className="text-xs font-primary font-semibold text-green">Required</span>
            </div>
            <div className="relative">
              <i className={`${fieldIconClass} fi fi-sr-user`} />
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="e.g. John Doe"
                className={fieldInputClass}
              />
            </div>
          </div>

          {/* card number — add mode only, can't be shown/changed for an existing card */}
          {!isEditMode && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                  Card Number
                </label>
                <span className="text-xs font-primary font-semibold text-green">Required</span>
              </div>
              <div className="relative">
                <i className={`${fieldIconClass} fi fi-sr-credit-card`} />
                <input
                  type="text"
                  inputMode="numeric"
                  value={cardDisplay}
                  onChange={handleCardNumberChange}
                  maxLength={cardMaxDisplayLength}
                  placeholder="e.g. 1234 5678 9012 3456"
                  className={`${fieldInputClass} ${cardInfo.name ? "pr-24" : ""}`}
                />
                {cardInfo.name && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <CardBrandBadge type={cardType} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* expiry + cvv (cvv add-mode only) */}
          <div className={isEditMode ? "" : "grid grid-cols-2 gap-5"}>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                  Expiry Date
                </label>
                <span className="text-xs font-primary font-semibold text-green">Required</span>
              </div>
              <div className="relative">
                <i className={`${fieldIconClass} fi fi-sr-calendar`} />
                <input
                  type="text"
                  inputMode="numeric"
                  value={expiryDisplay}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  placeholder="e.g. 05/26"
                  className={fieldInputClass}
                />
              </div>
              <p className="mt-2 flex items-center gap-1.5 px-space-1 text-xs text-sky-400">
                <i className="fi fi-rr-info" />
                MM/YY
              </p>
            </div>

            {!isEditMode && (
              <div>
                <div className="mb-2 flex items-center justify-between px-space-1">
                  <label className="px-space-1 font-primary text-size-large font-medium text-foreground">
                    CVV / CVC
                  </label>
                  <span className="text-xs font-primary font-semibold text-green">Required</span>
                </div>
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns: `repeat(${cvvLength}, minmax(0,1fr))`,
                  }}
                >
                  {cvvValues.map((val, i) => (
                    <input
                      key={i}
                      ref={(el) => (cvvRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleCvvChange(i, e)}
                      onKeyDown={(e) => handleCvvKeyDown(i, e)}
                      onPaste={handleCvvPaste}
                      onFocus={(e) => e.target.select()}
                      className="w-full rounded-xl border border-secondary/20 bg-background py-3 text-center text-size-large font-semibold text-foreground outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
                    />
                  ))}
                </div>
                <p className="mt-2 flex items-center gap-1.5 px-space-1 text-xs text-sky-400">
                  <i className="fi fi-rr-info" />
                  {cvvLength}-digit security code
                </p>
              </div>
            )}
          </div>

          {/* billing address */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <label className="px-space-1 text-sm font-medium font-primary text-size-large text-foreground">
                Billing Address
              </label>
              <span className="text-xs font-primary font-semibold text-green">
                City &amp; Country required
              </span>
            </div>
            <div className="grid grid-cols-2 gap-space-6">
              {BILLING_FIELDS.map(([key, placeholder]) => (
                <input
                  key={key}
                  value={billingAddress[key]}
                  onChange={handleBillingChange(key)}
                  placeholder={placeholder}
                  className="w-full rounded-xl border border-secondary/20 bg-background px-4 py-3 text-sm text-foreground placeholder-placeholder_3 outline-none transition-colors hover:border-secondary/50 focus-within:border-secondary/80"
                />
              ))}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="space-y-space-3 border-t border-white/5 pt-space-6">
          <div className="flex gap-3 *:w-full">
            <Button type="button" onClick={onClose} variant="secondary">
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handlePrimaryAction}
              disabled={!canSubmit || isSubmitting}
            >
              {isEditMode
                ? updating
                  ? "Saving..."
                  : "Save Changes"
                : requesting
                  ? "Sending OTP..."
                  : "Save Card"}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-center text-size-large font-semibold text-secondary">
            <i className="fi fi-rr-shield-check" />
            Your information is secure and we never store your CVV / CVC
          </div>
        </div>
      </div>
    </div>
  );
}
