#!/usr/bin/env bash
#
# PURPOSE:
#   This script recursively searches for PNG files in ./src/projections
#   whose names contain "portrait" and checks if they have a portrait
#   aspect ratio (height > width). If so, it rotates them in-place
#   by -90° (counter-clockwise) using ImageMagick v7 (the 'magick' command).
#
# HOW TO USE:
#   1) Make the script executable: chmod +x util_apply_ipad_rotation.sh
#   2) Run it: ./util_apply_ipad_rotation.sh
#   3) All matching files are automatically rotated in-place.
#
# REQUIREMENTS:
#   - ImageMagick v7+ installed (providing the 'magick' CLI).
#   - Bash shell (or compatible).
#

set -euo pipefail

# Make sure the 'magick' command is available (ImageMagick v7).
command -v magick >/dev/null 2>&1 || {
  echo "Error: 'magick' command not found. Please install ImageMagick (v7)."
  exit 1
}

# Recursively find all .png files in ./src/projections
# -iname makes it case-insensitive for .PNG vs .png
# Then loop through them
find ./src/assets/projection -type f -iname "*.png" | while read -r FILE; do
  # Check if the file name contains "portrait"
  if [[ "$FILE" == *"portrait"* ]]; then
    
    # Get width and height using ImageMagick 'identify'
    # e.g. "1024 1366"
    DIMS=$(magick identify -format "%w %h" "$FILE")
    WIDTH=$(echo "$DIMS" | cut -d' ' -f1)
    HEIGHT=$(echo "$DIMS" | cut -d' ' -f2)
    
    # Compare width and height (numeric comparison)
    if [ "$WIDTH" -lt "$HEIGHT" ]; then
      echo "Rotating '$FILE' counter-clockwise (-90°)."
      # Overwrite the original file with the rotated version
      magick "$FILE" -rotate -90 "$FILE"
    else
      echo "Skipping '$FILE' (already landscape or square)."
    fi
  else
    # Uncomment below if you want to see which files are being skipped
    # echo "Skipping '$FILE' (no 'portrait' in file name)."
    :
  fi
done
