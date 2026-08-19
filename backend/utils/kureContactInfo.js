const KURE_ADDRESS =
  "Flat No 308, 3rd Floor Rakesh Deep, Commercial Plot No 11, Yusuf Sarai Community Centre, New Delhi-110049";

const KURE_ADDRESS_WITH_COUNTRY = `${KURE_ADDRESS}, India`;

const KURE_ADDRESS_MULTILINE =
  "Flat No 308, 3rd Floor Rakesh Deep,\nCommercial Plot No 11, Yusuf Sarai Community Centre,\nNew Delhi-110049, India";

const KURE_DELIVERY_PICKUP = `Delivery from our pick point ${KURE_ADDRESS_WITH_COUNTRY}.`;

module.exports = {
  KURE_ADDRESS,
  KURE_ADDRESS_WITH_COUNTRY,
  KURE_ADDRESS_MULTILINE,
  KURE_DELIVERY_PICKUP,
};
