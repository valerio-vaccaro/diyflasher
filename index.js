const diymodelselJade = document.getElementById('diymodelselJade');
const diymodelselNerd = document.getElementById('diymodelselNerd');
const connectButtonJade = document.getElementById('connectButtonJade');
const connectButtonNerd = document.getElementById('connectButtonNerd');
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
const nerdPicker = {
  version: document.getElementById('nerdVersionSelect'),
  board: document.getElementById('nerdBoardSelect'),
  variant: document.getElementById('nerdVariantSelect'),
};
const firmwareSelectors = [diymodelselJade, diymodelselNerd, ...Object.values(jadePicker), ...Object.values(nerdPicker)];
const flashButtons = [connectButtonJade, connectButtonNerd];
const main = document.getElementById('main');

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
  selector.replaceChildren(...firmwares.map(({ value, label, firmwareVersion, board, variants }) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = label;
    option.dataset.firmwareVersion = firmwareVersion;
    option.dataset.board = board;
    option.dataset.variants = variants.join(',');
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

function variantLabel(firmware) {
  return firmware.variants.length > 0 ? firmware.variants.join(' · ') : 'Standard';
}

function setUpFirmwarePicker(finalSelector, picker, firmwares) {
  populateFirmwareSelector(finalSelector, firmwares);
  const versions = unique(firmwares.map(({ firmwareVersion }) => firmwareVersion));
  populateChoices(picker.version, versions.map((version) => ({ value: version, label: version })));

  const updateVariants = () => {
    const matches = firmwares.filter(({ firmwareVersion, board }) =>
      firmwareVersion === picker.version.value && board === picker.board.value
    );
    populateChoices(picker.variant, matches.map((firmware) => ({
      value: firmware.value,
      label: variantLabel(firmware),
    })));
    picker.variant.closest('.variant-field').classList.toggle('d-none', matches.length <= 1);
    finalSelector.value = picker.variant.value;
  };

  const updateBoards = () => {
    const boards = unique(firmwares
      .filter(({ firmwareVersion }) => firmwareVersion === picker.version.value)
      .map(({ board }) => board));
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
  document.querySelectorAll('.firmware-picker, .firmware-action').forEach((element) => {
    element.style.display = 'none';
  });
}

async function loadFirmwareCatalog() {
  try {
    const [jadeResponse, nerdResponse] = await Promise.all([
      fetch('./firmwares-jade.json'),
      fetch('./firmwares-nerdminer.json'),
    ]);
    if (!jadeResponse.ok || !nerdResponse.ok) {
      throw new Error('Unable to load firmware catalogs');
    }

    const [jadeFirmwares, nerdFirmwares] = await Promise.all([
      jadeResponse.json(),
      nerdResponse.json(),
    ]);
    const catalogsAreValid = [jadeFirmwares, nerdFirmwares].every((firmwares) =>
      Array.isArray(firmwares) && firmwares.length > 0 && firmwares.every(({ value, label, firmwareVersion, board, variants }) =>
        typeof value === 'string' && typeof label === 'string' &&
        typeof firmwareVersion === 'string' && typeof board === 'string' && Array.isArray(variants)
      )
    );
    if (!catalogsAreValid) {
      throw new Error('Firmware catalog has an invalid format');
    }

    setUpFirmwarePicker(diymodelselJade, jadePicker, jadeFirmwares);
    setUpFirmwarePicker(diymodelselNerd, nerdPicker, nerdFirmwares);
    flashButtons.forEach((button) => { button.disabled = false; });
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
  }

  try {
    await esploader.erase_flash();
  } catch (e) {
      console.error(e);
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
  setFlashingState(false);
  document.getElementById("success").innerHTML = "Successfully erased!";
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
      const response = await fetch("assets/" + diymodelselJade.value + "/" + item.fileName);
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
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
  setFlashingState(false);
  document.getElementById("success").innerHTML = "Successfully flashed " + diymodelselJade.options[diymodelselJade.selectedIndex].text;
};

connectButtonNerd.onclick = async () => {
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

  if (["han_1.6.4RC1_m5stack"].includes(diymodelselNerd.value)) {
    baudrate = 115200;
}

  try {
    esploader = new ESPLoader(transport, baudrate, null);
    chip = await esploader.main_fn();
  } catch (e) {
    console.error(e);
  }

  let addressesAndFiles = [
    {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
    {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
    {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
    {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
  ]; 
  
  if (["han_1.6.4RC1_m5stack"].includes(diymodelselNerd.value)) { // han
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
    ];
  } else if (["han_1.6.4RC1_wt32-sc01", "han_1.6.5RC1_wt32-sc01"].includes(diymodelselNerd.value)) { // han2
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
    ];
  } else if (["han_1.6.4RC1_wt32-sc01-plus", "han_1.6.5RC1_wt32-sc01-plus"].includes(diymodelselNerd.value)) { // han2
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
    ];
  } else if (["nerdminer2_1.6.4RC1_ESP32-2432S024"].includes(diymodelselNerd.value)) { // nerdminer2_1.6.4RC1_ESP32-2432S024
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
    ];
  
  } else if (["nerdminer2_1.6.3_tdisplays3"].includes(diymodelselNerd.value)) { // nerd
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
  } else if (["nerdminer2_1.6.3_esp32wroom"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
   } else if (["nerdminer2_1.6.3_tdiplay_S3_Amoled"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
      } else if (["nerdminer2_1.6.3_T_QT"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
    } else if (["nerdminer2_1.6.3_tdisplayv1"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
    } else if (["nerdminer2_1.6.3_s3Dongle"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
   } else if (["nerdminer2_1.6.3_ESP32-2432S028R"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
  } else if (["nerdminer2_1.6.3_M5-StampS3"].includes(diymodelselNerd.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
  }
  let fileArray = [];

  for (const item of addressesAndFiles) {

      console.log(`Address: ${item.address}, File Name: ${item.fileName}`);
      const response = await fetch("assets/" + diymodelselNerd.value + "/" + item.fileName);
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
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
  setFlashingState(false);
  document.getElementById("success").innerHTML = "Successfully flashed " + diymodelselNerd.options[diymodelselNerd.selectedIndex].text;
};
