const lightRange = document.querySelector("#lightRange");
const loadRange = document.querySelector("#loadRange");
const scene = document.querySelector("#cellScene");

function updateSimulation() {
  const lightPercent = Number(lightRange.value);
  const loadOhms = Number(loadRange.value);
  const light = lightPercent / 100;

  // Modelo Thevenin sencillo: intensidad luminosa define Voc e Isc.
  const openCircuitVoltage = 9.17 * Math.sqrt(light);
  const shortCircuitCurrent = 0.009 * light;
  const internalResistance = shortCircuitCurrent > 0 ? openCircuitVoltage / shortCircuitCurrent : Infinity;
  const voltage = internalResistance === Infinity
    ? 0
    : openCircuitVoltage * loadOhms / (loadOhms + internalResistance);
  const currentAmps = loadOhms > 0 ? voltage / loadOhms : 0;
  const currentMilliAmps = currentAmps * 1000;
  const powerMilliWatts = voltage * currentMilliAmps;

  document.querySelector("#lightValue").textContent = `${lightPercent}%`;
  document.querySelector("#loadValue").textContent = loadOhms;
  document.querySelector("#voltageValue").textContent = voltage.toFixed(2);
  document.querySelector("#currentValue").textContent = currentMilliAmps.toFixed(2);
  document.querySelector("#powerValue").textContent = powerMilliWatts.toFixed(2);
  scene.dataset.light = lightPercent;
  scene.style.setProperty("--ray-alpha", String(light * 0.9));

  const fill = lightPercent;
  lightRange.style.background = `linear-gradient(90deg, #ffbb0b ${fill}%, #e7edf3 ${fill}%)`;
  const loadFill = ((loadOhms - Number(loadRange.min)) / (Number(loadRange.max) - Number(loadRange.min))) * 100;
  loadRange.style.background = `linear-gradient(90deg, #ffbb0b ${loadFill}%, #e7edf3 ${loadFill}%)`;
}

lightRange.addEventListener("input", updateSimulation);
loadRange.addEventListener("input", updateSimulation);
updateSimulation();
