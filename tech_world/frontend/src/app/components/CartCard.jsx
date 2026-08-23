import Image from "next/image";

export function CartCard({ data, actions }) {
  const { image = assets.overlay1, title, requirement, price, quantity } = data;

  return (
    <div className="flex w-105 items-center gap-3 rounded-xl border border-white/10 bg-[#12141c] p-3">
      <Image
        width={100}
        height={100}
        src={image}
        alt={title}
        className="h-14 w-14 shrink-0 rounded-lg object-cover"
      />

      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-medium text-slate-100">{title}</h4>
        {requirement && (
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {requirement}
          </p>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-white">{money(price)}</p>
        <p className="text-xs text-slate-500">
          Qty: <span className="text-slate-300">{quantity}</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-[42px] rounded-[8px] bg-red/5 border-[1.5px] border-red/10">
          <i class="fi fi-rr-trash text-size-h5"></i>
        </div>
        <div className="flex items-center justify-center size-[42px] rounded-[8px] bg-green/5 border-[1.5px] border-green/10">
          <i class="fi fi-rr-trash text-size-h5"></i>
        </div>
        <div className="flex items-center justify-center size-[42px] rounded-[8px] bg-secondary/5 border-[1.5px] border-secondary/10">
          <i class="fi fi-rr-trash text-size-h5"></i>
        </div>
      </div>
    </div>
  );
}

/* =====================  4. SMALL CART  ===================== */
export function SmallCartCard({ data, actions }) {
  const { image = assets.overlay1, title, price, quantity } = data;

  return (
    <div className="flex w-full items-center rounded-xl border border-white/10 p-3 gap-space-5">
      <Image
        width={100}
        height={100}
        src={image}
        alt={title}
        className="h-15 w-11 shrink-0 rounded-lg object-cover mr-space-4"
      />

      <div className="min-w-0 flex-1 mr-space-2">
        <h4 className="truncate text-size-large font-medium text-slate-100">{title}</h4>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-0.5 mr-space-5">
        <p className="text-size-h6 font-semibold">{money(price)}</p>
        <p className="text-size-small text-slate-500">Qty: <span className="size-[18px] rounded-[4px] bg-secondary/20 text-size-small text-secondary">{quantity}</span></p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-[42px] rounded-[8px] bg-red/5 border-[1.5px] border-red/10">
          <i class="fi fi-rr-trash text-size-h5"></i>
        </div>
        <div className="flex items-center justify-center size-[42px] rounded-[8px] bg-green/5 border-[1.5px] border-green/10">
          <i class="fi fi-rr-trash text-size-h5"></i>
        </div>
      </div>
    </div>
  );
}

