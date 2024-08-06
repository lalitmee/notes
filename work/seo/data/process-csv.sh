#!/bin/bash

# Read parent CSV into an associative array
declare -A parent_map

while IFS=, read -r id name description; do
    parent_map[$name]=$id
done <smart-collections.csv

# Process child CSV
while IFS=, read -r handle other_info; do
    id=${parent_map[${handle%% *}]}
    if [ -n "$id" ]; then
        echo "$id, $handle, $other_info"
    else
        echo "$handle, $other_info"
    fi
done <collections-meta-data-arabic.csv >output.csv
