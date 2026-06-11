import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const getProductPrice = (product = {}) =>
  Number(product?.price ?? product?.prices?.price ?? 0);

const getProductDate = (product = {}) =>
  new Date(product?.createdAt || product?.updatedAt || 0).getTime();

const isFeaturedProduct = (product = {}) =>
  product?.type === "popular" ||
  (Array.isArray(product?.tag) &&
    product.tag.some((t) => String(t).toLowerCase() === "featured"));

const useFilter = (data) => {
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("");
  const router = useRouter();

  const productData = useMemo(() => {
    let services = Array.isArray(data) ? [...data] : [];

    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
    }

    if (sortedField === "Newest") {
      services = services.sort(
        (a, b) => getProductDate(b) - getProductDate(a)
      );
    } else if (sortedField === "Featured") {
      services = services.sort((a, b) => {
        const diff = Number(isFeaturedProduct(b)) - Number(isFeaturedProduct(a));
        return diff !== 0 ? diff : getProductDate(b) - getProductDate(a);
      });
    } else if (sortedField === "Low") {
      services = services.sort(
        (a, b) => getProductPrice(a) - getProductPrice(b)
      );
    } else if (sortedField === "High") {
      services = services.sort(
        (a, b) => getProductPrice(b) - getProductPrice(a)
      );
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedField, data]);

  return {
    productData,
    pending,
    processing,
    delivered,
    setSortedField,
    sortedField,
  };
};

export default useFilter;
