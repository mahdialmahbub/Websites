"use client";

// Turns the address fields into one readable line, e.g.
// "House 12, Road 5, Kafrul, Mirpur, Dhaka 1212, Bangladesh."
const formatAddress = (a) => {
  const line1 = [
    a.apartmentNumber && `Apartment ${a.apartmentNumber}`,
    a.buildingNumber && `House ${a.buildingNumber}`,
    a.roadNumber && `Road ${a.roadNumber}`,
    a.locality,
    a.area,
  ]
    .filter(Boolean)
    .join(", ");

  const line2 = [a.city, a.postCode].filter(Boolean).join(" ");
  const tail = [line2, a.country].filter(Boolean).join(", ");

  return [line1, tail].filter(Boolean).join(", ") + ".";
};

/**
 * One row for ONE saved address. The parent (Cart page) fetches the list
 * and maps over it — same pattern as SavedCard.
 *
 * Props:
 *   address   — { _id, apartmentNumber, buildingNumber, roadNumber, locality, area, city, postCode, country, isDefault }
 *   selected  — true if this is the delivery address chosen for checkout
 *   onSelect / onDelete / onEdit
 */
const SavedAddress = ({ address, selected = false, onSelect, onDelete, onEdit }) => {
  return (
    <div
      onClick={onSelect}
      className={`flex gap-space-4 p-space-3 rounded-lg border cursor-pointer transition-colors ${
        selected ? "border-secondary bg-secondary/20" : "border-secondary/30 bg-secondary/5 hover:bg-secondary/10"
      }`}
    >
      <div className="size-7 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
        <i className="fi fi-sr-land-layer-location text-size-large text-secondary"></i>
      </div>

      <p className="flex-1 font-primary text-size-h6 font-medium text-[#CBD5F5]">
        {formatAddress(address)}
        {address.isDefault && <span className="ml-2 text-xs text-emerald-400">(Default)</span>}
      </p>

      <div className="flex items-center gap-space-3 shrink-0">
        <i
          className="fi fi-rr-trash text-size-h6 text-red cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
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
      </div>
    </div>
  );
};

export default SavedAddress;
