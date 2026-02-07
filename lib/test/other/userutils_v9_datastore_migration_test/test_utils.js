function setIsAvailableLabel(id, isAvailable) {
  const element = document.getElementById(`lbl-${id}`);
  element.textContent = isAvailable ? "✅ Available" : "❌ Not Available";
}

/** Checks for the availability of certain APIs and libraries and updates the UI accordingly. */
function checkAvailabilities() {
  setIsAvailableLabel("greasemonkey-available",   "GM" in globalThis && typeof globalThis.GM?.getValue === "function");
  setIsAvailableLabel("userutils-available",      "UserUtils" in globalThis && typeof globalThis.UserUtils?.DataStore === "function");
  setIsAvailableLabel("coreutils-available",      "CoreUtils" in globalThis && typeof globalThis.CoreUtils?.DataStore === "function");
  setIsAvailableLabel("test-setup-available",     "__TestSetup" in globalThis);
  setIsAvailableLabel("test-migration-available", "__TestMigration" in globalThis);
}

document.addEventListener("DOMContentLoaded", () => {
  checkAvailabilities();
});
