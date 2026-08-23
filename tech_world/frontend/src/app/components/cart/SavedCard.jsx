"use client";

import Image from "next/image";
import { CreditCard as CreditCardIcon } from "lucide-react";
import { assets } from "../../assets/assets";

const NETWORK_LOGO = {
  Visa: assets.visaCardLogo,
  Mastercard: assets.mastercardLogo,
};

/**
 * One row for ONE saved card. The parent (Cart page) is responsible for
 * fetching the list of cards and mapping over them — this component just
 * renders a single card + handles its own click/select/delete/edit events.
 *
 * Props:
 *   card      — { _id, network, maskedNumber, cardHolderName, ... }
 *   selected  — true if this card is the one currently chosen for checkout
 *   onSelect  — called when the row itself is clicked
 *   onDelete  — called when the trash icon is clicked
 *   onEdit    — called when the edit icon is clicked
 */
const SavedCard = ({ card, selected = false, onSelect, onDelete, onEdit, isAdmin = false }) => {
  const logo = NETWORK_LOGO[card.network];

  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-space-4 p-space-3 rounded-lg border cursor-pointer transition-colors ${
        selected ? "border-secondary bg-secondary/20" : "border-secondary/30 bg-secondary/5 hover:bg-secondary/10"
      }`}
    >
      {/* Icon */}
      <div className="p-space-1 rounded-sm h-5.5 w-[32px] relative bg-primary/10 flex items-center justify-center shrink-0">
        {logo ? (
          <Image alt={card.network} width={32} height={22} src={logo} className="object-contain" />
        ) : (
          <CreditCardIcon size={16} className="text-secondary" />
        )}
      </div>

      <h4 className="w-full font-primary font-medium text-size-h6 text-[#CBD5F5] tracking-wider">
        {card.maskedNumber}
      </h4>

      {!isAdmin && <div className="flex items-center gap-space-3 shrink-0">
        <i
          className="fi fi-rr-trash text-size-h6 text-red cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // don't also trigger onSelect
            onDelete?.();
          }}
        ></i>
        <i
          className="fi fi-rr-edit text-size-h6 text-secondary cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
        ></i>
      </div>}
    </div>
  );
};

export default SavedCard;
