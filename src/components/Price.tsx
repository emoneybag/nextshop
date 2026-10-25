import { formatPrice } from "@/lib/format";

export default function Price({
  price,
  compareAt,
  size = "md",
}: {
  price: number;
  compareAt?: number;
  size?: "md" | "lg";
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        className={`display font-semibold ${size === "lg" ? "text-3xl" : "text-lg"}`}
      >
        {formatPrice(price)}
      </span>
      {compareAt && (
        <span className="text-sm text-muted line-through">
          {formatPrice(compareAt)}
        </span>
      )}
    </div>
  );
}
