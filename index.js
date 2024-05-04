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
const lbldiymodelsJade = document.getElementById('lbldiymodelsJade');
const lbldiymodelsNerd = document.getElementById('lbldiymodelsNerd');

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
  connectButtonJade.style.display = 'none';
  lbldiymodelsJade.style.display = 'none';
  diymodelselJade.style.display = 'none';
  connectButtonNerd.style.display = 'none';
  lbldiymodelsNerd.style.display = 'none';
  diymodelselNerd.style.display = 'none';
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
  document.getElementById("success").innerHTML = "Successfully erased!";
}

connectButtonJade.onclick = async () => {
  eraseButton.style.display = 'none';
  connectButtonJade.style.display = 'none';
  lbldiymodelsJade.style.display = 'none';
  diymodelselJade.style.display = 'none';
  connectButtonNerd.style.display = 'none';
  lbldiymodelsNerd.style.display = 'none';
  diymodelselNerd.style.display = 'none';
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

  if (["jade_0.1.48_m5stickcplus", "jade_1.0.21_m5stickcplus", "jade_1.0.26_display_m5stickcplus", "jade_1.0.27_display_m5stickcplus"].includes(diymodelselJade.value)) {
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
  document.getElementById("success").innerHTML = "Successfully flashed " + diymodelselJade.options[diymodelselJade.selectedIndex].text;
};

connectButtonNerd.onclick = async () => {
  eraseButton.style.display = 'none';
  connectButtonJade.style.display = 'none';
  lbldiymodelsJade.style.display = 'none';
  diymodelselJade.style.display = 'none';
  connectButtonNerd.style.display = 'none';
  lbldiymodelsNerd.style.display = 'none';
  diymodelselNerd.style.display = 'none';
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
  } else if (["han_1.6.4RC1_wt32-sc01"].includes(diymodelselNerd.value)) { // han2
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
    ];
  } else if (["han_1.6.4RC1_wt32-sc01-plus"].includes(diymodelselNerd.value)) { // han2
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
  
  } else if (["nerdminer2_1.6.3_tdisplays3"].includes(diymodelsel.value)) { // nerd
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
  } else if (["nerdminer2_1.6.3_esp32wroom"].includes(diymodelsel.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
   } else if (["nerdminer2_1.6.3_tdiplay_S3_Amoled"].includes(diymodelsel.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
      } else if (["nerdminer2_1.6.3_T_QT"].includes(diymodelsel.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
    } else if (["nerdminer2_1.6.3_tdisplayv1"].includes(diymodelsel.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
    } else if (["nerdminer2_1.6.3_s3Dongle"].includes(diymodelsel.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x0000', fileName: '0x0000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
   } else if (["nerdminer2_1.6.3_ESP32-2432S028R"].includes(diymodelsel.value)) { // nerd WROOM
    addressesAndFiles = [
      {address: '0x1000', fileName: '0x1000_bootloader.bin', progressBar: btprogressBar},
      {address: '0x8000', fileName: '0x8000_partitions.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: '0xe000_boot_app0.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: '0x10000_firmware.bin', progressBar: firmwareprogressBar},
   ];
  } else if (["nerdminer2_1.6.3_M5-StampS3"].includes(diymodelsel.value)) { // nerd WROOM
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
  document.getElementById("success").innerHTML = "Successfully flashed " + diymodelselNerd.options[diymodelselNerd.selectedIndex].text;
};
