export const API_PATH =
  window.location.protocol + "//" + "quarantine.pmhsolution.com";

if (window.location.protocol === "https:") {
  window.location.replace(
    `http:${window.location.href.substring(window.location.protocol.length)}`
  );
}
