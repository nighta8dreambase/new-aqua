export const API_PATH =
  window.location.protocol + "//" + "quarantine.pmhsolution.com";

  console.log(API_PATH);

if (window.location.protocol === "https:") {
  window.location.replace(
    `https:${window.location.href.substring(window.location.protocol.length)}`
  );
}
