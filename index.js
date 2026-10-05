const diymodelselJade = document.getElementById('diymodelselJade');
const diymodelselBitfloppy = document.getElementById('diymodelselBitfloppy');
const diymodelselNerd = document.getElementById('diymodelselNerd');
const diymodelselHan = document.getElementById('diymodelselHan');
const diymodelselSatulator = document.getElementById('diymodelselSatulator');
const diymodelselSfyl = document.getElementById('diymodelselSfyl');
const diymodelselEspinserver = document.getElementById('diymodelselEspinserver');
const diymodelselBtcp = document.getElementById('diymodelselBtcp');
const diymodelselRetardminer = document.getElementById('diymodelselRetardminer');
const diymodelselEasyminer = document.getElementById('diymodelselEasyminer');
const diymodelselSertun32 = document.getElementById('diymodelselSertun32');
const diymodelselMouse64 = document.getElementById('diymodelselMouse64');
const diymodelselNostrPager = document.getElementById('diymodelselNostrPager');
const diymodelselTovarishSatoshi = document.getElementById('diymodelselTovarishSatoshi');
const connectButtonJade = document.getElementById('connectButtonJade');
const connectButtonBitfloppy = document.getElementById('connectButtonBitfloppy');
const connectButtonNerd = document.getElementById('connectButtonNerd');
const connectButtonHan = document.getElementById('connectButtonHan');
const connectButtonSatulator = document.getElementById('connectButtonSatulator');
const connectButtonSfyl = document.getElementById('connectButtonSfyl');
const connectButtonEspinserver = document.getElementById('connectButtonEspinserver');
const connectButtonBtcp = document.getElementById('connectButtonBtcp');
const connectButtonRetardminer = document.getElementById('connectButtonRetardminer');
const connectButtonEasyminer = document.getElementById('connectButtonEasyminer');
const connectButtonSertun32 = document.getElementById('connectButtonSertun32');
const connectButtonMouse64 = document.getElementById('connectButtonMouse64');
const connectButtonNostrPager = document.getElementById('connectButtonNostrPager');
const connectButtonTovarishSatoshi = document.getElementById('connectButtonTovarishSatoshi');
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
const espinserverPicker = {
  version: document.getElementById('espinserverVersionSelect'),
  board: document.getElementById('espinserverBoardSelect'),
  variant: document.getElementById('espinserverVariantSelect'),
};
const btcpPicker = {
  version: document.getElementById('btcpVersionSelect'),
  board: document.getElementById('btcpBoardSelect'),
  variant: document.getElementById('btcpVariantSelect'),
};
const retardminerPicker = {
  version: document.getElementById('retardminerVersionSelect'),
  board: document.getElementById('retardminerBoardSelect'),
  variant: document.getElementById('retardminerVariantSelect'),
};
const easyminerPicker = {
  version: document.getElementById('easyminerVersionSelect'),
  board: document.getElementById('easyminerBoardSelect'),
  variant: document.getElementById('easyminerVariantSelect'),
};
const sertun32Picker = {
  version: document.getElementById('sertun32VersionSelect'),
  board: document.getElementById('sertun32BoardSelect'),
  variant: document.getElementById('sertun32VariantSelect'),
};
const mouse64Picker = {
  version: document.getElementById('mouse64VersionSelect'),
  board: document.getElementById('mouse64BoardSelect'),
  variant: document.getElementById('mouse64VariantSelect'),
};
const nostrPagerPicker = {
  version: document.getElementById('nostrPagerVersionSelect'),
  board: document.getElementById('nostrPagerBoardSelect'),
  variant: document.getElementById('nostrPagerVariantSelect'),
};
const tovarishSatoshiPicker = {
  version: document.getElementById('tovarishSatoshiVersionSelect'),
  board: document.getElementById('tovarishSatoshiBoardSelect'),
  variant: document.getElementById('tovarishSatoshiVariantSelect'),
};
const firmwareSelectors = [
  diymodelselJade, diymodelselBitfloppy, diymodelselNerd, diymodelselHan, diymodelselSatulator, diymodelselSfyl,
  diymodelselEspinserver, diymodelselBtcp, diymodelselRetardminer, diymodelselEasyminer,
  diymodelselSertun32, diymodelselMouse64, diymodelselNostrPager, diymodelselTovarishSatoshi,
  ...Object.values(jadePicker), ...Object.values(bitfloppyPicker), ...Object.values(nerdPicker), ...Object.values(hanPicker),
  ...Object.values(satulatorPicker), ...Object.values(sfylPicker), ...Object.values(espinserverPicker),
  ...Object.values(btcpPicker), ...Object.values(retardminerPicker), ...Object.values(easyminerPicker),
  ...Object.values(sertun32Picker), ...Object.values(mouse64Picker),
  ...Object.values(nostrPagerPicker), ...Object.values(tovarishSatoshiPicker),
];
const main = document.getElementById('main');
const successMessage = document.getElementById('success');
const backToHomeButton = document.getElementById('backToHomeButton');
const emoticonRain = document.getElementById('emoticonRain');
const firmwareSummary = document.getElementById('firmwareSummary');
let emoticonRainTimeout;

function animatePickerField(selector) {
  const field = selector.parentElement;
  field.classList.remove('is-updating');
  void field.offsetWidth;
  field.classList.add('is-updating');
}

function setFlashingState(isFlashing) {
  main.classList.toggle('is-flashing', isFlashing);
  if (isFlashing) {
    main.classList.remove('has-flash-result');
  }
  main.setAttribute('aria-busy', String(isFlashing));
}

function setFlashResultState(hasResult) {
  main.classList.toggle('has-flash-result', hasResult);
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
    if (firmware.files?.length) {
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
  if (firmwares.length === 0) {
    picker.version.replaceChildren(new Option('No releases available', ''));
    picker.board.replaceChildren(new Option('No boards available', ''));
    picker.version.disabled = true;
    picker.board.disabled = true;
    picker.variant.closest('.variant-field').classList.add('d-none');
    return;
  }
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
  successMessage.textContent = '';
  successMessage.classList.remove('is-error');
  backToHomeButton.hidden = true;
}

function setFirmwareSummary(selector, operation = 'Flash', baudrate) {
  const selectedOption = selector?.selectedOptions[0];
  const details = operation === 'Erase'
    ? [['Operation', 'Erase entire flash'], ['Connection', 'USB serial']]
    : [
      ['Firmware', selectedOption.text],
      ['Version', selectedOption.dataset.firmwareVersion || 'Not specified'],
      ['Platform', selectedOption.dataset.board || 'Not specified'],
      ['Build', selectedOption.dataset.variants || 'Standard'],
      ['Baud rate', `${baudrate || selectedOption.dataset.baudrate || 921600} baud`],
    ];
  firmwareSummary.replaceChildren(...details.map(([label, value]) => {
    const item = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    item.append(term, description);
    return item;
  }));
}

function setProgressMessage(message, isError = false) {
  successMessage.textContent = message;
  successMessage.classList.toggle('is-error', isError);
}

function showFlashError(error, prefix = 'Flashing failed') {
  const detail = error instanceof Error ? error.message : String(error);
  setProgressMessage(`${prefix}: ${detail}`, true);
  showStatusEmoticonRain('error');
  setFlashResultState(true);
  showHomeButton();
}

function showStatusEmoticonRain(status) {
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
  setFlashResultState(false);
  setProgressMessage('');
  backToHomeButton.hidden = true;
  document.querySelectorAll('.progress-card [id$="progress"], .progress-card [id$="progresslbl"]').forEach((element) => {
    element.style.display = 'none';
  });
  main.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

async function loadFirmwareCatalog() {
  try {
    const [jadeResponse, bitfloppyResponse, nerdResponse, hanResponse, satulatorResponse, sfylResponse,
      espinserverResponse, btcpResponse, retardminerResponse, easyminerResponse,
      sertun32Response, mouse64Response, nostrPagerResponse, tovarishSatoshiResponse] = await Promise.all([
      fetch('./firmwares-jade.json'),
      fetch('./firmwares-bitfloppy.json'),
      fetch('./firmwares-nerdminer.json'),
      fetch('./firmwares-han.json'),
      fetch('./firmwares-satulator.json'),
      fetch('./firmwares-sfyl.json'),
      fetch('./firmwares-espinserver.json'),
      fetch('./firmwares-btc-pb.json'),
      fetch('./firmwares-retardminer.json'),
      fetch('./firmwares-easyminer.json'),
      fetch('./firmwares-sertun32.json'),
      fetch('./firmwares-mouse64.json'),
      fetch('./firmwares-nostr-pager.json'),
      fetch('./firmwares-tovarish-satoshi.json'),
    ]);
    if ([jadeResponse, bitfloppyResponse, nerdResponse, hanResponse, satulatorResponse, sfylResponse,
      espinserverResponse, btcpResponse, retardminerResponse, easyminerResponse,
      sertun32Response, mouse64Response, nostrPagerResponse, tovarishSatoshiResponse].some((response) => !response.ok)) {
      throw new Error('Unable to load firmware catalogs');
    }

    const [jadeFirmwares, bitfloppyFirmwares, nerdFirmwares, hanFirmwares, satulatorFirmwares, sfylFirmwares,
      espinserverFirmwares, btcpFirmwares, retardminerFirmwares, easyminerFirmwares,
      sertun32Firmwares, mouse64Firmwares, nostrPagerFirmwares, tovarishSatoshiFirmwares] = await Promise.all([
      jadeResponse.json(),
      bitfloppyResponse.json(),
      nerdResponse.json(),
      hanResponse.json(),
      satulatorResponse.json(),
      sfylResponse.json(),
      espinserverResponse.json(),
      btcpResponse.json(),
      retardminerResponse.json(),
      easyminerResponse.json(),
      sertun32Response.json(),
      mouse64Response.json(),
      nostrPagerResponse.json(),
      tovarishSatoshiResponse.json(),
    ]);
    const catalogsAreValid = [jadeFirmwares, bitfloppyFirmwares, nerdFirmwares, hanFirmwares, satulatorFirmwares, sfylFirmwares,
      espinserverFirmwares, btcpFirmwares, retardminerFirmwares, easyminerFirmwares,
      sertun32Firmwares, mouse64Firmwares, nostrPagerFirmwares, tovarishSatoshiFirmwares].every((firmwares) =>
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
      [diymodelselEspinserver, espinserverPicker, espinserverFirmwares, connectButtonEspinserver],
      [diymodelselBtcp, btcpPicker, btcpFirmwares, connectButtonBtcp],
      [diymodelselRetardminer, retardminerPicker, retardminerFirmwares, connectButtonRetardminer],
      [diymodelselEasyminer, easyminerPicker, easyminerFirmwares, connectButtonEasyminer],
      [diymodelselSertun32, sertun32Picker, sertun32Firmwares, connectButtonSertun32],
      [diymodelselMouse64, mouse64Picker, mouse64Firmwares, connectButtonMouse64],
      [diymodelselNostrPager, nostrPagerPicker, nostrPagerFirmwares, connectButtonNostrPager],
      [diymodelselTovarishSatoshi, tovarishSatoshiPicker, tovarishSatoshiFirmwares, connectButtonTovarishSatoshi],
    ];
    catalogs.forEach(([selector, picker, firmwares, button]) => {
      setUpFirmwarePicker(selector, picker, firmwares);
      button.disabled = firmwares.length === 0 || (button !== connectButtonJade && firmwares.every((firmware) => !firmware.files?.length));
      const projectLink = button.closest('.firmware-card')?.querySelector('.project-link');
      const projectUrl = firmwares.find((firmware) => firmware.projectUrl)?.projectUrl;
      if (projectLink && projectUrl) {
        projectLink.href = projectUrl;
        projectLink.hidden = false;
      }
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
  hideFirmwareControls();
  setFirmwareSummary(null, 'Erase');
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
    setFlashingState(false);
    return;
  }

  try {
    await esploader.erase_flash();
  } catch (e) {
    console.error(e);
    showFlashError(e, 'Erase failed');
    setFlashingState(false);
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(false);
  await new Promise((resolve) => setTimeout(resolve, 100));
  await transport.setDTR(true);
  setFlashingState(false);
  setProgressMessage("Successfully erased!");
  setFlashResultState(true);
  showStatusEmoticonRain('success');
  showHomeButton();
}

connectButtonJade.onclick = async () => {
  hideFirmwareControls();
  const baudrate = diymodelselJade.value.includes('m5stickcplus') ? 115200 : 921600;
  setFirmwareSummary(diymodelselJade, 'Flash', baudrate);
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
  setFlashResultState(true);
  showStatusEmoticonRain('success');
  showHomeButton();
};

async function flashRemoteFirmware(selector) {
  hideFirmwareControls();
  setFirmwareSummary(selector);
  setFlashingState(true);

  try {
    const selectedOption = selector.selectedOptions[0];
    const files = JSON.parse(selectedOption.dataset.firmwareFiles);
    const baudrate = Number(selectedOption.dataset.baudrate);
    const manualBootloader = selectedOption.dataset.manualBootloader === 'true';
    const useStub = selectedOption.dataset.useStub !== 'false';
    const progressBars = [btprogressBar, ptprogressBar, otaprogressBar, firmwareprogressBar];
    const progressLabels = [btprogressBarLbl, ptprogressBarLbl, otaprogressBarLbl, firmwareprogressBarlbl];
    const fileLabels = files.map((file, index) => {
      if (files.length === 1) return 'Factory image';
      const name = file.name.toLowerCase();
      if (name.includes('bootloader')) return 'Bootloader';
      if (name.includes('partition')) return 'Partition table';
      if (name.includes('ota') || file.address.toLowerCase() === '0xe000') return 'OTA initial data';
      if (name.includes('firmware') || name.endsWith('jade.bin')) return 'Firmware';
      return `File ${index + 1}`;
    });

    if (device === null) {
      device = await navigator.serial.requestPort({});
      transport = new Transport(device);
    }

    progressBars.forEach((progressBar, index) => {
      const isUsed = index < files.length;
      progressBar.style.display = isUsed ? 'block' : 'none';
        progressLabels[index].style.display = isUsed ? 'block' : 'none';
      if (isUsed) {
        progressLabels[index].querySelector('label').textContent = fileLabels[index];
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
    setFlashResultState(true);
    showStatusEmoticonRain('success');
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
connectButtonEspinserver.onclick = () => flashRemoteFirmware(diymodelselEspinserver);
connectButtonBtcp.onclick = () => flashRemoteFirmware(diymodelselBtcp);
connectButtonRetardminer.onclick = () => flashRemoteFirmware(diymodelselRetardminer);
connectButtonEasyminer.onclick = () => flashRemoteFirmware(diymodelselEasyminer);
connectButtonSertun32.onclick = () => flashRemoteFirmware(diymodelselSertun32);
connectButtonMouse64.onclick = () => flashRemoteFirmware(diymodelselMouse64);
connectButtonNostrPager.onclick = () => flashRemoteFirmware(diymodelselNostrPager);
connectButtonTovarishSatoshi.onclick = () => flashRemoteFirmware(diymodelselTovarishSatoshi);
