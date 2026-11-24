const wavelengthRange = document.querySelector("#wavelengthRange");
const lightRange = document.querySelector("#lightRange");
const loadRange = document.querySelector("#loadRange");
const scene = document.querySelector("#cellScene");
const circuitToggle = document.querySelector("#circuitToggle");
let circuitClosed = true;

function updateSimulation() {
  const wavelengthNm = Number(wavelengthRange.value);
  const lightPercent = Number(lightRange.value);
  const loadOhms = Number(loadRange.value);
  const light = lightPercent / 100;
  const photonEnergyEv = 1240 / wavelengthNm;
  const siliconBandGapEv = 1.12;
  const photonCanActivateSilicon = photonEnergyEv >= siliconBandGapEv;
  const activeLight = photonCanActivateSilicon ? light : 0;

  // Modelo didáctico: la intensidad cambia la corriente y la carga cambia el punto de operación.
  const openCircuitVoltage = activeLight > 0
    ? 9.17 * (0.8 + 0.2 * (Math.log1p(activeLight * 9) / Math.log(10)))
    : 0;
  const shortCircuitCurrent = 0.009 * activeLight;
  const internalResistance = shortCircuitCurrent > 0 ? openCircuitVoltage / shortCircuitCurrent : Infinity;
  const voltage = !circuitClosed
    ? openCircuitVoltage
    : internalResistance === Infinity
      ? 0
      : openCircuitVoltage * loadOhms / (loadOhms + internalResistance);
  const currentAmps = circuitClosed && loadOhms > 0 ? voltage / loadOhms : 0;
  const currentMilliAmps = currentAmps * 1000;
  const powerMilliWatts = voltage * currentMilliAmps;

  document.querySelector("#wavelengthValue").textContent = wavelengthNm;
  document.querySelector("#lightValue").textContent = `${lightPercent}%`;
  document.querySelector("#loadValue").textContent = loadOhms;
  document.querySelector("#photonEnergy").textContent = photonEnergyEv.toFixed(2);
  document.querySelector("#voltageValue").textContent = voltage.toFixed(2);
  document.querySelector("#currentValue").textContent = currentMilliAmps.toFixed(2);
  document.querySelector("#powerValue").textContent = powerMilliWatts.toFixed(2);
  document.querySelector("#photonLabel").textContent = `Fotones · ${wavelengthNm} nm`;

  scene.dataset.light = lightPercent;
  scene.dataset.threshold = photonCanActivateSilicon ? "met" : "below";
  scene.dataset.circuit = circuitClosed ? "closed" : "open";
  scene.style.setProperty("--ray-alpha", String(light * 0.9));
  scene.style.setProperty("--light-level", String(light));
  scene.style.setProperty("--photon-speed", `${(3 - light * 2.3).toFixed(2)}s`);
  const photonHue = Math.max(0, Math.min(270, 270 - ((wavelengthNm - 380) / (1200 - 380)) * 270));
  scene.style.setProperty("--photon-color", wavelengthNm > 1107 ? "#b8c6d4" : `hsl(${photonHue} 88% 62%)`);
  scene.style.setProperty("--bulb-glow", String(Math.min(1, Math.max(0, (voltage - 1.5) / 4))));

  const thresholdMessage = document.querySelector("#thresholdMessage");
  const sceneStatus = document.querySelector("#sceneStatus");
  const circuitCaption = document.querySelector("#circuitCaption");
  const switchText = document.querySelector("#switchText");
  const loadSymbol = document.querySelector("#loadSymbol");

  if (!photonCanActivateSilicon) {
    thresholdMessage.textContent = "Este color de luz no aporta energía suficiente para liberar electrones.";
    thresholdMessage.dataset.state = "inactive";
    sceneStatus.innerHTML = "<i></i> Energía insuficiente";
  } else if (lightPercent === 0) {
    thresholdMessage.textContent = "Aumenta la intensidad para enviar fotones a la celda.";
    thresholdMessage.dataset.state = "inactive";
    sceneStatus.innerHTML = "<i></i> Sin iluminación";
  } else {
    thresholdMessage.textContent = "¡Sí! Este paquete de luz puede poner una carga en movimiento.";
    thresholdMessage.dataset.state = "active";
    sceneStatus.innerHTML = "<i></i> Fotón absorbido";
  }

  if (circuitClosed) {
    switchText.textContent = "Abrir circuito";
    circuitCaption.textContent = photonCanActivateSilicon && lightPercent > 0
      ? "Electrones en movimiento · circuito cerrado"
      : "Sin cargas en movimiento";
    loadSymbol.classList.toggle("is-lit", currentMilliAmps > 0 && voltage > 1.5);
  } else {
    switchText.textContent = "Cerrar circuito";
    circuitCaption.textContent = "Circuito abierto · no circula corriente";
    loadSymbol.classList.remove("is-lit");
  }

  circuitToggle.setAttribute("aria-pressed", String(circuitClosed));
  document.querySelector("#lightHint").textContent = lightPercent === 0
    ? "Sin fotones, no se generan pares electrón-hueco."
    : `Llegan más fotones por segundo al ${lightPercent}% de intensidad.`;

  const lightFill = lightPercent;
  lightRange.style.background = `linear-gradient(90deg, #ffbb0b ${lightFill}%, #e7edf3 ${lightFill}%)`;
  const loadFill = ((loadOhms - Number(loadRange.min)) / (Number(loadRange.max) - Number(loadRange.min))) * 100;
  loadRange.style.background = `linear-gradient(90deg, #ffbb0b ${loadFill}%, #e7edf3 ${loadFill}%)`;
  wavelengthRange.style.background = "linear-gradient(90deg, #7b4ce2 0%, #4c8cf5 17%, #4dbd7e 34%, #d9d84b 52%, #f6a83f 70%, #e75b54 84%, #8e5b77 100%)";
}

wavelengthRange.addEventListener("input", updateSimulation);
lightRange.addEventListener("input", updateSimulation);
loadRange.addEventListener("input", updateSimulation);
circuitToggle.addEventListener("click", () => {
  circuitClosed = !circuitClosed;
  updateSimulation();
});
updateSimulation();
