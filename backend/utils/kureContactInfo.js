const KURE_ADDRESS =
  "H655+4CW, Balbir Saxena Marg, Yusuf Sarai, New Delhi, Delhi 110049";

const KURE_ADDRESS_WITH_COUNTRY = `${KURE_ADDRESS}, India`;

const KURE_ADDRESS_MULTILINE =
  "H655+4CW, Balbir Saxena Marg,\nYusuf Sarai, New Delhi,\nDelhi 110049, India";

const KURE_DELIVERY_PICKUP = `Delivery from our pick point ${KURE_ADDRESS_WITH_COUNTRY}.`;

module.exports = {
  KURE_ADDRESS,
  KURE_ADDRESS_WITH_COUNTRY,
  KURE_ADDRESS_MULTILINE,
  KURE_DELIVERY_PICKUP,
};
