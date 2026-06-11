import useTranslation from "next-translate/useTranslation";
import {
  getStockStatus,
  getStockDisplayText,
} from "@utils/inventory";

const STOCK_STYLES = {
  "in-stock": "bg-green-100 text-green-800",
  "low-stock": "bg-amber-100 text-amber-800",
  "out-of-stock": "bg-red-100 text-red-800",
};

const STOCK_DOTS = {
  "in-stock": "bg-green-500",
  "low-stock": "bg-amber-500",
  "out-of-stock": "bg-red-500",
};

const Stock = ({ product, stock, lowStockThreshold, card, inline }) => {
  const { t } = useTranslation();
  const productLike =
    product && typeof product === "object"
      ? product
      : { stock, lowStockThreshold };
  const status = getStockStatus(productLike);
  const displayText = getStockDisplayText(productLike);
  const style = STOCK_STYLES[status] || STOCK_STYLES["out-of-stock"];
  const dot = STOCK_DOTS[status] || STOCK_DOTS["out-of-stock"];

  if (inline) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide normal-case ${style}`}
      >
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} aria-hidden />
        {displayText}
      </span>
    );
  }

  if (card) {
    return (
      <span
        className={`absolute z-10 top-2 right-2 rounded-full inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold tracking-wide normal-case max-w-[85%] truncate ${style}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} aria-hidden />
        {displayText}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide normal-case ${style}`}
      >
        <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden />
        {displayText}
      </span>
    </div>
  );
};

export default Stock;
