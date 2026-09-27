#!/bin/bash

FILE="$1"

if [ -z "$FILE" ]; then
  echo "Usage: $0 <file.mp3>"
  exit 1
fi

ffplay -nodisp -autoexit "$FILE" >/dev/null 2>&1 &