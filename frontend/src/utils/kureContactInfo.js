export const KURE_ADDRESS =
  "Flat No 308, 3rd Floor Rakesh Deep, Commercial Plot No 11, Yusuf Sarai Community Centre, New Delhi-110049";

export const KURE_ADDRESS_WITH_COUNTRY = `${KURE_ADDRESS}, India`;

export const KURE_ADDRESS_MULTILINE =
  "Flat No 308, 3rd Floor Rakesh Deep,\nCommercial Plot No 11, Yusuf Sarai Community Centre,\nNew Delhi-110049, India";

export const KURE_ADDRESS_LINES = [
  "Flat No 308, 3rd Floor Rakesh Deep,",
  "Commercial Plot No 11, Yusuf Sarai Community Centre,",
  "New Delhi-110049, India",
];

export const KURE_ADDRESS_MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent("Kure Pharma, " + KURE_ADDRESS_WITH_COUNTRY)}&output=embed`;

export const KURE_DELIVERY_PICKUP = `Delivery from our pick point ${KURE_ADDRESS_WITH_COUNTRY}.`;

export default KURE_ADDRESS;
