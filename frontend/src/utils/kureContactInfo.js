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

// Official Google Maps Place Embed for Kure Pharma (Place ID: ChIJ7wfLCADjDDkRCdEcVtKgohI / CID: 0x390ce30008cb07ef:0x12a2a0d2561cd109).
// Using the verified permanent Place embed guarantees the map locks directly onto "Kure pharma" (with 3.0 rating card),
// and prevents Google Maps from showing search results or pinning nearby businesses like "kure international".
export const KURE_ADDRESS_MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.395955302636!2d77.2085843!3d28.5578674!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce30008cb07ef%3A0x12a2a0d2561cd109!2sKure%20pharma!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus";

export const KURE_DELIVERY_PICKUP = `Delivery from our pick point ${KURE_ADDRESS_WITH_COUNTRY}.`;

export default KURE_ADDRESS;
