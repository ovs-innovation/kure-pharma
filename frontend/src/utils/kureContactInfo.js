export const KURE_ADDRESS =
  "H655+4CW, Balbir Saxena Marg, Yusuf Sarai, New Delhi, Delhi 110049";

export const KURE_ADDRESS_WITH_COUNTRY = `${KURE_ADDRESS}, India`;

export const KURE_ADDRESS_MULTILINE =
  "H655+4CW, Balbir Saxena Marg,\nYusuf Sarai, New Delhi,\nDelhi 110049, India";

export const KURE_ADDRESS_LINES = [
  "H655+4CW, Balbir Saxena Marg,",
  "Yusuf Sarai, New Delhi,",
  "Delhi 110049, India",
];

export const KURE_ADDRESS_MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(KURE_ADDRESS)}&output=embed`;

export const KURE_DELIVERY_PICKUP = `Delivery from our pick point ${KURE_ADDRESS_WITH_COUNTRY}.`;

export default KURE_ADDRESS;
