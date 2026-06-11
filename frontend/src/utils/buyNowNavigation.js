import Cookies from "js-cookie";

export const buildBuyNowRoute = (checkoutQuery = {}) => {
  const params = new URLSearchParams();
  Object.entries(checkoutQuery).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `/checkout?${qs}` : "/checkout";
};

export const isUserLoggedIn = (userInfo) =>
  Boolean(userInfo || (typeof window !== "undefined" && Cookies.get("userInfo")));

export const navigateToBuyNow = (router, { userInfo, checkoutQuery }) => {
  const checkoutPath = buildBuyNowRoute(checkoutQuery);

  if (!isUserLoggedIn(userInfo)) {
    router.push(
      `/auth/login?redirectUrl=${encodeURIComponent(checkoutPath)}`
    );
    return;
  }

  router.push({ pathname: "/checkout", query: checkoutQuery });
};
