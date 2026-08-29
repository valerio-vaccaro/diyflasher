#!/usr/bin/env bash
# Flash the complete SATulator release bundle to an ESP32-2432S028R on Linux.
# Run this script from the extracted GitHub Actions firmware artifact.

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 /dev/ttyUSB0" >&2
  echo "Example: $0 /dev/ttyACM0" >&2
  exit 64
fi

port=$1
artifact_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

if [[ ! -e $port ]]; then
  echo "Serial device not found: $port" >&2
  exit 66
fi

for firmware_file in \
  SATulator-esp32-2432s028-bootloader.bin \
  SATulator-esp32-2432s028-partitions.bin \
  SATulator-esp32-2432s028-boot_app0.bin \
  SATulator-esp32-2432s028.bin; do
  if [[ ! -f "$artifact_dir/$firmware_file" ]]; then
    echo "Missing $firmware_file. Extract the complete firmware artifact first." >&2
    exit 65
  fi
done

if command -v esptool.py >/dev/null 2>&1; then
  esptool=(esptool.py)
else
  esptool=(python3 -m esptool)
fi

echo "Flashing SATulator to $port..."
"${esptool[@]}" --chip esp32 --port "$port" --baud 460800 \
  --before default_reset --after hard_reset write_flash -z \
  0x1000 "$artifact_dir/SATulator-esp32-2432s028-bootloader.bin" \
  0x8000 "$artifact_dir/SATulator-esp32-2432s028-partitions.bin" \
  0xe000 "$artifact_dir/SATulator-esp32-2432s028-boot_app0.bin" \
  0x10000 "$artifact_dir/SATulator-esp32-2432s028.bin"

echo "Done. The board will restart into SATulator."
