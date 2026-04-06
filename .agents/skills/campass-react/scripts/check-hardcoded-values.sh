#!/bin/bash
# Simple script to find hardcoded color values (#...)

# Check if filename is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <file-path>"
  exit 1
fi

FILE_PATH=$1

echo "Scanning for hardcoded color values in '$FILE_PATH'..."
grep -oin -n '#[0-9a-fA-F]\{3,6\}' "$FILE_PATH"

if [ $? -eq 0 ]; then
  echo "----------------------------------------"
  echo "Warning: Hardcoded color values found. Please replace them with CSS variables."
  exit 1
else
  echo "Check complete: No hardcoded color values found."
  exit 0
fi
