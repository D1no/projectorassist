#!/usr/bin/env bash
#
# PURPOSE:
#   This script recursively searches for PNG files in its own directory's assets/public/slides
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

# Get the absolute directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure 'magick' command is available (ImageMagick v7)
command -v magick >/dev/null 2>&1 || {
  echo "Error: 'magick' command not found. Please install ImageMagick (v7)."
  exit 1
}

# Recursively find all .png files in the script's own assets/public/slides directory
find "$SCRIPT_DIR/assets/public/slides" -type f -iname "*.png" | while read -r FILE; do
  # Check if the file name contains "portrait"
  if [[ "$FILE" == *"portrait"* ]]; then
    
    # Get width and height using ImageMagick 'identify'
    DIMS=$(magick identify -format "%w %h" "$FILE")
    WIDTH=$(echo "$DIMS" | cut -d' ' -f1)
    HEIGHT=$(echo "$DIMS" | cut -d' ' -f2)
    
    # Compare width and height (numeric comparison)
    if [ "$WIDTH" -lt "$HEIGHT" ]; then
      echo "Rotating '$FILE' counter-clockwise (-90°)."
      magick "$FILE" -rotate -90 "$FILE"
    fi
  fi
done

echo "COMPLETE: Rotate files named 'portrait' in their name in the assets/slides/** folder."