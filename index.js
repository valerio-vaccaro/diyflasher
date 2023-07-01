const diymodelsel = document.getElementById('diymodelsel');
const connectButton = document.getElementById('connectButton');
const btprogressBar = document.getElementById('bootloaderprogress');
const btprogressBarLbl = document.getElementById('bootloaderprogresslbl');
const otaprogressBar = document.getElementById('otaprogress');
const otaprogressBarLbl = document.getElementById('otaprogresslbl');
const ptprogressBar = document.getElementById('partitiontableprogress');
const ptprogressBarLbl = document.getElementById('partitiontableprogresslbl');
const firmwareprogressBar = document.getElementById('firmwareprogress');
const firmwareprogressBarlbl = document.getElementById('firmwareprogresslbl');
const lbldiymodels = document.getElementById('lbldiymodels');

// import { Transport } from './cp210x-webusb.js'
import * as esptooljs from "./bundle.js";
const ESPLoader = esptooljs.ESPLoader;
const Transport = esptooljs.Transport;

let device = null;
let transport;
let chip = null;
let esploader;

connectButton.onclick = async () => {
  connectButton.style.display = 'none';
  lbldiymodels.style.display = 'none';
  diymodelsel.style.display = 'none';
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

  if (diymodelsel.value == "jade_0.1.48_m5stickcplus") {
      baudrate = 115200;
  }

  try {
    esploader = new ESPLoader(transport, baudrate, null);
    chip = await esploader.main_fn();
  } catch (e) {
    console.error(e);
  }

  const addressesAndFiles = [
    {address: '0x1000', fileName: 'bootloader.bin', progressBar: btprogressBar},
    {address: '0x9000', fileName: 'partition-table.bin', progressBar: ptprogressBar},
    {address: '0xE000', fileName: 'ota_data_initial.bin', progressBar: otaprogressBar},
    {address: '0x10000', fileName: 'jade.bin', progressBar: firmwareprogressBar},
  ];  

  if (["han_m5stack"].includes(diymodelsel.value)) { // han
    addressesAndFiles = [
      {address: '0x1000', fileName: 'bootloader.bin', progressBar: btprogressBar},
      {address: '0x9000', fileName: 'partition-table.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: 'ota_data_initial.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: 'firmware.bin', progressBar: firmwareprogressBar},
    ];
  } else if (["han2_0.0.1_wt32-sc01", "han2_0.0.1_wt32-sc01-plus"].includes(diymodelsel.value)) { // han2
    addressesAndFiles = [
      {address: '0x1000', fileName: 'bootloader.bin', progressBar: btprogressBar},
      {address: '0x9000', fileName: 'partition-table.bin', progressBar: ptprogressBar},
      {address: '0xE000', fileName: 'ota_data_initial.bin', progressBar: otaprogressBar},
      {address: '0x10000', fileName: 'firmware.bin', progressBar: firmwareprogressBar},
    ];
  } else if (["nerdminer2_1.4_tdisplays3", "nerdminer2_1.5.1-beta_tdisplays3"].includes(diymodelsel.value)) { // nerd
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
      const response = await fetch("assets/" + diymodelsel.value + "/" + item.fileName);
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
  document.getElementById("success").innerHTML = "Successfully flashed " + diymodelsel.options[diymodelsel.selectedIndex].text;
};
