"use client";

import Image from "next/image";
import Tag from "../../Tag";

const OrderItemsRow = ({ item }) => {
  // Requirement: variants আগে, color একদম শেষে
  const requirementParts = [
    ...(item.selectedVariants?.map((v) => v.name) ?? []),
    item?.color,
  ].filter(Boolean);

  const requirementText =
    requirementParts.length > 0
      ? `Requirement: ${requirementParts.join(", ")}.`
      : null;

  return (
    <tr className="border-b border-secondary/5 last:border-0 odd:bg-primary/5 even:bg-secondary/5 transition-colors hover:odd:bg-primary/10 hover:even:bg-secondary/10 *:first:rounded-l-xl *:last:rounded-r-xl overflow-hidden text-size-h6 *:p-space-3">
      {/* product informations */}
      <td>
        <div className="flex items-center gap-space-3">
          {/* Thumbnail */}
          {item.productImage ? (
            <div className="relative size-13 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10">
              <Image
                src={item.productImage}
                alt={item.productTitle ?? "product"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="size-13 rounded-xl bg-white/5 border border-white/10 shrink-0 flex items-center justify-center text-placeholder_3">
              <i className="fi fi-rr-box-open text-size-h5" />
            </div>
          )}
          <div className="space-y-0.5">
            <p className="font-medium text-size-large whitespace-nowrap">
              {item.productTitle ?? "—"}
            </p>
            <p className="text-size-h6 text-placeholder_2">
              {requirementText ?? "—"}
            </p>
          </div>
        </div>
      </td>

      <td>
        <Tag text={item.quantity}/>
      </td>

      {/* Total */}
      <td className="font-semibold whitespace-nowrap">${item.totalPrice}</td>
    </tr>
  );
};

export default OrderItemsRow;
