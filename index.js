const diymodelselJade = document.getElementById('diymodelselJade');
const diymodelselBitfloppy = document.getElementById('diymodelselBitfloppy');
const diymodelselNerd = document.getElementById('diymodelselNerd');
const diymodelselHan = document.getElementById('diymodelselHan');
const diymodelselSatulator = document.getElementById('diymodelselSatulator');
const diymodelselSfyl = document.getElementById('diymodelselSfyl');
const connectButtonJade = document.getElementById('connectButtonJade');
const connectButtonBitfloppy = document.getElementById('connectButtonBitfloppy');
const connectButtonNerd = document.getElementById('connectButtonNerd');
const connectButtonHan = document.getElementById('connectButtonHan');
const connectButtonSatulator = document.getElementById('connectButtonSatulator');
const connectButtonSfyl = document.getElementById('connectButtonSfyl');
const btprogressBar = document.getElementById('bootloaderprogress');
const btprogressBarLbl = document.getElementById('bootloaderprogresslbl');
const otaprogressBar = document.getElementById('otaprogress');
const otaprogressBarLbl = document.getElementById('otaprogresslbl');
const ptprogressBar = document.getElementById('partitiontableprogress');
const ptprogressBarLbl = document.getElementById('partitiontableprogresslbl');
const firmwareprogressBar = document.getElementById('firmwareprogress');
const firmwareprogressBarlbl = document.getElementById('firmwareprogresslbl');
const jadePicker = {
  version: document.getElementById('jadeVersionSelect'),
  board: document.getElementById('jadeBoardSelect'),
  variant: document.getElementById('jadeVariantSelect'),
};
const bitfloppyPicker = {
  version: document.getElementById('bitfloppyVersionSelect'),
  board: document.getElementById('bitfloppyBoardSelect'),
  variant: document.getElementById('bitfloppyVariantSelect'),
};
const nerdPicker = {
  version: document.getElementById('nerdVersionSelect'),
  board: document.getElementById('nerdBoardSelect'),
  variant: document.getElementById('nerdVariantSelect'),
};
const hanPicker = {
  version: document.getElementById('hanVersionSelect'),
  board: document.getElementById('hanBoardSelect'),
  variant: document.getElementById('hanVariantSelect'),
};
const satulatorPicker = {
  version: document.getElementById('satulatorVersionSelect'),
  board: document.getElementById('satulatorBoardSelect'),
  variant: document.getElementById('satulatorVariantSelect'),
};
const sfylPicker = {
  version: document.getElementById('sfylVersionSelect'),
  board: document.getElementById('sfylBoardSelect'),
  variant: document.getElementById('sfylVariantSelect'),
};
const firmwareSelectors = [
  diymodelselJade, diymodelselBitfloppy, diymodelselNerd, diymodelselHan, diymodelselSatulator, diymodelselSfyl,
  ...Object.values(jadePicker), ...Object.values(bitfloppyPicker), ...Object.values(nerdPicker), ...Object.values(hanPicker),
  ...Object.values(satulatorPicker), ...Object.values(sfylPicker),
];
const main = document.getElementById('main');
const successMessage = document.getElementById('success');
const backToHomeButton = document.getElementById('backToHomeButton');
const emoticonRain = document.getElementById('emoticonRain');
let emoticonRainTimeout;

function animatePickerField(selector) {
  const field = selector.parentElement;
  field.classList.remove('is-updating');
  void field.offsetWidth;
  field.classList.add('is-updating');
}

function setFlashingState(isFlashing) {
  main.classList.toggle('is-flashing', isFlashing);
  main.setAttribute('aria-busy', String(isFlashing));
}

function populateFirmwareSelector(selector, firmwares) {
  selector.replaceChildren(...firmwares.map((firmware) => {
    const { value, label, firmwareVersion, board, variants } = firmware;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.dataset.firmwareVersion = firmwareVersion;
    option.dataset.board = board;
    option.dataset.variants = variants.join(',');
    if (firmware.files) {
      option.dataset.firmwareFiles = JSON.stringify(firmware.files);
      option.dataset.baudrate = String(firmware.baudrate || 115200);
      option.dataset.manualBootloader = String(firmware.manualBootloader === true);
      option.dataset.useStub = String(firmware.useStub !== false);
    }
    return option;
  }));
}

function populateChoices(selector, choices) {
  selector.replaceChildren(...choices.map(({ value, label }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    return option;
  }));
  selector.disabled = choices.length === 0;
  animatePickerField(selector);
}

function unique(values) {
  return [...new Set(values)];
}

function lexicographicalSort(values) {
  return values.sort((first, second) => first.localeCompare(second));
}

function variantLabel(firmware) {
  if (firmware.board.startsWith('Jade v')) {
    const noBluetooth = firmware.variants.some((variant) => variant.includes('no radio'));
    const ci = firmware.variants.some((variant) => variant.includes('ci'));
    return `${noBluetooth ? 'nobluetooth' : 'bluetooth'}${ci ? '_ci' : ''}`;
  }
  return firmware.variants.length > 0 ? firmware.variants.join(' · ') : 'Standard';
}

function setUpFirmwarePicker(finalSelector, picker, firmwares) {
  populateFirmwareSelector(finalSelector, firmwares);
  const versions = unique(firmwares.map(({ firmwareVersion }) => firmwareVersion));
  populateChoices(picker.version, versions.map((version) => ({ value: version, label: version })));

  const updateVariants = () => {
    const matches = firmwares
      .filter(({ firmwareVersion, board }) => firmwareVersion === picker.version.value && board === picker.board.value)
      .sort((first, second) => variantLabel(first).localeCompare(variantLabel(second)));
    populateChoices(picker.variant, matches.map((firmware) => ({
      value: firmware.value,
      label: variantLabel(firmware),
    })));
    picker.variant.closest('.variant-field').classList.toggle('d-none', matches.length <= 1);
    finalSelector.value = picker.variant.value;
  };

  const updateBoards = () => {
    const boards = lexicographicalSort(unique(firmwares
      .filter(({ firmwareVersion }) => firmwareVersion === picker.version.value)
      .map(({ board }) => board)));
    populateChoices(picker.board, boards.map((board) => ({ value: board, label: board })));
    updateVariants();
  };

  picker.version.onchange = () => {
    animatePickerField(picker.version);
    updateBoards();
  };
  picker.board.onchange = () => {
    animatePickerField(picker.board);
    updateVariants();
  };
  picker.variant.onchange = () => {
    animatePickerField(picker.variant);
    finalSelector.value = picker.variant.value;
  };
  updateBoards();
}

function hideFirmwareControls() {
  backToHomeButton.hidden = true;
  successMessage.textContent = '';
  successMessage.classList.remove('is-error');
  document.querySelectorAll('.firmware-picker, .firmware-action').forEach((element) => {
    element.style.display = 'none';
  });
}

function setProgressMessage(message, isError = false) {
  successMessage.textContent = message;
  successMessage.classList.toggle('is-error', isError);
}

function showFlashError(error, prefix = 'Flashing failed') {
  const detail = error instanceof Error ? error.message : String(error);
  setProgressMessage(`${prefix}: ${detail}`, true);
  backToHomeButton.hidden = true;
}

function showEraseEmoticonRain(status) {
  const emoticons = status === 'success'
    ? ['🎉', '✨', '🧹', '✅', '🚀', '💫']
    : ['⚠️', '❌', '😵', '🔌', '🛑'];

  window.clearTimeout(emoticonRainTimeout);
  emoticonRain.replaceChildren();
  const drops = document.createDocumentFragment();
  for (let index = 0; index < 32; index += 1) {
    const drop = document.createElement('span');
    drop.className = 'emoticon-rain__drop';
    drop.textContent = emoticons[index % emoticons.length];
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.setProperty('--drift', `${Math.round((Math.random() - 0.5) * 180)}px`);
    drop.style.setProperty('--spin', `${Math.round((Math.random() - 0.5) * 540)}deg`);
    drop.style.setProperty('--fall-duration', `${1.7 + Math.random() * 1.3}s`);
    drop.style.setProperty('--fall-delay', `${Math.random() * 0.5}s`);
    drops.append(drop);
  }
  emoticonRain.append(drops);
  emoticonRainTimeout = window.setTimeout(() => emoticonRain.replaceChildren(), 3800);
}

function showHomeButton() {
  backToHomeButton.hidden = false;
}

backToHomeButton.onclick = () => {
  document.querySelectorAll('.firmware-picker, .firmware-action').forEach((element) => {
    element.style.display = '';
  });
  eraseButton.style.display = '';
  setProgressMessage('');
  backToHomeButton.hidden = true;
  document.querySelectorAll('.progress-card [id$="progress"], .progress-card [id$="progresslbl"]').forEach((element) => {
    element.style.display = 'none';
  });
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

async function loadFirmwareCatalog() {
  try {
    const [jadeResponse, bitfloppyResponse, nerdResponse, hanResponse, satulatorResponse, sfylResponse] = await Promise.all([
      fetch('./firmwares-jade.json'),
      fetch('./firmwares-bitfloppy.json'),
      fetch('./firmwares-nerdminer.json'),
      fetch('./firmwares-han.json'),
      fetch('./firmwares-satulator.json'),
      fetch('./firmwares-sfyl.json'),
    ]);
    if (!jadeResponse.ok || !bitfloppyResponse.ok || !nerdResponse.ok || !hanResponse.ok || !satulatorResponse.ok || !sfylResponse.ok) {
      throw new Error('Unable to load firmware catalogs');
    }

    const [jadeFirmwares, bitfloppyFirmwares, nerdFirmwares, hanFirmwares, satulatorFirmwares, sfylFirmwares] = await Promise.all([
      jadeResponse.json(),
      bitfloppyResponse.json(),
      nerdResponse.json(),
      hanResponse.json(),
      satulatorResponse.json(),
      sfylResponse.json(),
    ]);
    const catalogsAreValid = [jadeFirmwares, bitfloppyFirmwares, nerdFirmwares, hanFirmwares, satulatorFirmwares, sfylFirmwares].every((firmwares) =>
      Array.isArray(firmwares) && firmwares.every(({ value, label, firmwareVersion, board, variants }) =>
        typeof value === 'string' && typeof label === 'string' &&
        typeof firmwareVersion === 'string' && typeof board === 'string' && Array.isArray(variants)
      )
    );
    if (!catalogsAreValid) {
      throw new Error('Firmware catalog has an invalid format');
    }

    const catalogs = [
      [diymodelselJade, jadePicker, jadeFirmwares, connectButtonJade],
      [diymodelselBitfloppy, bitfloppyPicker, bitfloppyFirmwares, connectButtonBitfloppy],
      [diymodelselNerd, nerdPicker, nerdFirmwares, connectButtonNerd],
      [diymodelselHan, hanPicker, hanFirmwares, connectButtonHan],
      [diymodelselSatulator, satulatorPicker, satulatorFirmwares, connectButtonSatulator],
      [diymodelselSfyl, sfylPicker, sfylFirmwares, connectButtonSfyl],
    ];
    catalogs.forEach(([selector, picker, firmwares, button]) => {
      setUpFirmwarePicker(selector, picker, firmwares);
      button.disabled = firmwares.length === 0;
    });
  } catch (error) {
    console.error(error);
    firmwareSelectors.forEach((selector) => {
      if (selector.options.length > 0) {
        selector.options[0].textContent = 'Firmware catalog unavailable';
      }
    });
    document.getElementById('success').textContent = 'Unable to load the firmware catalog. Reload the page and try again.';
  }
}

loadFirmwareCatalog();

// import { Transport } from './cp210x-webusb.js'
import * as esptooljs from "./bundle.js";
const ESPLoader = esptooljs.ESPLoader;
const Transport = esptooljs.Transport;

let device = null;
let transport;
let chip = null;
let esploader;

eraseButton.onclick = async () => {
  eraseButton.style.display = 'none';
  hideFirmwareControls();
  setFlashingState(true);
  if (device === null) {
    device = await navigator.serial.requestPort({});
    transport = new Transport(device);
  }
  var baudrate = 115200;

  try {
    esploader = new ESPLoader(transport, baudrate, null);
    chip = await esploader.main_fn();
  } catch (e) {
    console.error(e);
    showFlashError(e, 'Erase failed');
    showEraseEmoticonRain('error');
    setFlashingState(false);
    return;
  }

  try {
    await esploader.erase_flash();
  } catch (e) {
    console.error(e);
    showFlashError(e, 'Erase failed');
    showEraseEmoticonRain('error');
    setFlashingState(false);
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
  setFlashingState(false);
  setProgressMessage("Successfully erased!");
  showEraseEmoticonRain('success');
  showHomeButton();
}

connectButtonJade.onclick = async () => {
  eraseButton.style.display = 'none';
  hideFirmwareControls();
  setFlashingState(true);
  if (device === null) {
    device = await navigator.serial.requestPort({});
    transport = new Transport(device);
  }

  btprogressBar.style.display = 'block';
  otaprogressBar.style.display = 'block';
  ptprogressBar.style.display = 'block';
  firmwareprogressBar.style.display = 'block';

  btprogressBarLbl.style.display = 'block';
  otaprogressBarLbl.style.display = 'block';
  ptprogressBarLbl.style.display = 'block';
  firmwareprogressBarlbl.style.display = 'block';

  var baudrate = 921600;

  if (diymodelselJade.value.includes("m5stickcplus")) {
      baudrate = 115200;
  }

  try {
    esploader = new ESPLoader(transport, baudrate, null);
    chip = await esploader.main_fn();
  } catch (e) {
    console.error(e);
    showFlashError(e);
    setFlashingState(false);
    return;
  }

  let addressesAndFiles = [
    {address: '0x1000', fileName: 'bootloader.bin', progressBar: btprogressBar},
    {address: '0x9000', fileName: 'partition-table.bin', progressBar: ptprogressBar},
    {address: '0xE000', fileName: 'ota_data_initial.bin', progressBar: otaprogressBar},
    {address: '0x10000', fileName: 'jade.bin', progressBar: firmwareprogressBar},
  ];

  if ((diymodelselJade.value.includes("s3")) || (diymodelselJade.value.includes("_v2")) || (diymodelselJade.value.includes("waveshare"))) {
    addressesAndFiles = [
      {address: '0x0000', fileName: 'bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: 'partition-table.bin', progressBar: ptprogressBar},
      {address: '0x1A000', fileName: 'ota_data_initial.bin', progressBar: otaprogressBar},
      {address: '0x20000', fileName: 'jade.bin', progressBar: firmwareprogressBar},
    ];
  }

  let fileArray = [];

  for (const item of addressesAndFiles) {

      console.log(`Address: ${item.address}, File Name: ${item.fileName}`);
      const response = await fetch("assets/jade/" + diymodelselJade.value + "/" + item.fileName);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fileBlob = await response.blob();
      const fileData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsBinaryString(fileBlob);
      });
      fileArray.push({
          data: fileData,
          address: item.address
      });
  }
  try {
      await esploader.write_flash(
          fileArray,
          'keep',
          'keep',
          'keep',
          false,
          true,
          (fileIndex, written, total) => {
            addressesAndFiles[fileIndex].progressBar.value = (written / total) * 100;
          },
          null
      );
  } catch (e) {
    console.error(e);
    showFlashError(e);
    setFlashingState(false);
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
  setFlashingState(false);
  setProgressMessage("Successfully flashed " + diymodelselJade.options[diymodelselJade.selectedIndex].text);
  showHomeButton();
};

async function flashRemoteFirmware(selector) {
  eraseButton.style.display = 'none';
  hideFirmwareControls();
  setFlashingState(true);

  try {
    const selectedOption = selector.selectedOptions[0];
    const files = JSON.parse(selectedOption.dataset.firmwareFiles);
    const baudrate = Number(selectedOption.dataset.baudrate);
    const manualBootloader = selectedOption.dataset.manualBootloader === 'true';
    const useStub = selectedOption.dataset.useStub !== 'false';
    const progressBars = [btprogressBar, ptprogressBar, otaprogressBar, firmwareprogressBar];
    const progressLabels = [btprogressBarLbl, ptprogressBarLbl, otaprogressBarLbl, firmwareprogressBarlbl];

    if (device === null) {
      device = await navigator.serial.requestPort({});
      transport = new Transport(device);
    }

    progressBars.forEach((progressBar, index) => {
      const isUsed = index < files.length;
      progressBar.style.display = isUsed ? 'block' : 'none';
      progressLabels[index].style.display = isUsed ? 'block' : 'none';
      if (isUsed) {
        progressLabels[index].querySelector('label').textContent = files.length === 1
          ? 'Factory image'
          : ['Bootloader', 'Partition table', 'OTA initial data', 'Firmware'][index];
      }
      progressBar.value = 0;
    });

    esploader = new ESPLoader(transport, baudrate, null);
    chip = await esploader.main_fn(manualBootloader ? 'no_reset' : 'default_reset', useStub);

    const fileArray = await Promise.all(files.map(async (file) => {
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`Unable to download ${file.name}: ${response.status}`);
      }
      const fileBlob = await response.blob();
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsBinaryString(fileBlob);
      });
      return { data, address: file.address };
    }));

    await esploader.write_flash(
      fileArray,
      'keep',
      'keep',
      'keep',
      false,
      true,
      (fileIndex, written, total) => {
        progressBars[fileIndex].value = (written / total) * 100;
      },
      null
    );
    // Native USB boards do not provide DTR, and ROM flashing above already
    // requests a reboot. Keep the traditional reset for UART boards only.
    if (!manualBootloader) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await transport.setDTR(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await transport.setDTR(true);
    }
    setProgressMessage(`Successfully flashed ${selectedOption.text}`);
    showHomeButton();
  } catch (error) {
    console.error(error);
    showFlashError(error);
  } finally {
    setFlashingState(false);
  }
}

connectButtonBitfloppy.onclick = () => flashRemoteFirmware(diymodelselBitfloppy);
connectButtonNerd.onclick = () => flashRemoteFirmware(diymodelselNerd);
connectButtonHan.onclick = () => flashRemoteFirmware(diymodelselHan);
connectButtonSatulator.onclick = () => flashRemoteFirmware(diymodelselSatulator);
connectButtonSfyl.onclick = () => flashRemoteFirmware(diymodelselSfyl);
