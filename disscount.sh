#!/bin/bash

# NOTE: if getting permission denied, give write perms with chmod +x disscount.sh

# Arguments: PDF file, first page, last page
PDF_FILE=$1
FIRST_PAGE=$2
LAST_PAGE=$3

# Check if the right number of arguments are supplied
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <PDF_FILE> <FIRST_PAGE> <LAST_PAGE>"
    exit 1
fi

# Convert page to text
PAGE_TEXT=$(pdftotext -f $FIRST_PAGE -l $FIRST_PAGE "$PDF_FILE" -);


if echo "$PAGE_TEXT" | grep -q "Introduction"; then
    echo "Success: The string 'Introduction' was found on page $FIRST_PAGE of $PDF_FILE."
elif echo "$PAGE_TEXT" | grep -q "Chapter\ 1"; then
    echo "Success: The string 'Chapter 1' was found on page $FIRST_PAGE of $PDF_FILE."
else
    echo "!!! WARNING: Neither 'Introduction' nor 'Chapter 1' was found on page $FIRST_PAGE !!!"
fi

# Array of commands with placeholders for arguments
commands=(
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '[A-Za-z]{4}' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '[A-Za-z]{3}' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '[A-Za-z]{2}' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '[A-Za-z]' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '\w{4}' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '\w{3}' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '\w{2}' | wc -w"
  "pdftotext -f {START} -l {END} '{PDF}' - | egrep '\w' | wc -w"
)

declare -A command_outputs
declare -a sorted_commands

# Iterate over commands, execute each one, and store their outputs
for command in "${commands[@]}"; do
  # Replace placeholders with actual arguments
  command=${command//'{PDF}'/$PDF_FILE}
  command=${command//'{START}'/$FIRST_PAGE}
  command=${command//'{END}'/$LAST_PAGE}

  # Execute command and store its output
  output=$(eval ${command//'{PDF}'/$PDF_FILE})

  # Store command and its output in associative array
  command_outputs["$command"]=$output
done

# Convert associative array to indexed array and sort by word counts
for command in "${!command_outputs[@]}"; do
  sorted_commands+=("${command_outputs[$command]} - $command")
done

IFS=$'\n' sorted_commands=($(sort -n <<<"${sorted_commands[*]}"))
unset IFS

# Print sorted commands and their outputs
for item in "${sorted_commands[@]}"; do
  echo "Command: $(echo $item | cut -d '-' -f 2-)"
  echo "Output: $(echo $item | cut -d '-' -f 1)"
done
