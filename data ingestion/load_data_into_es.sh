#!/usr/bin/env bash


# DATA_DIR="/Volumes/Seagate/gutenberg-dataset-files-cleanup/data/"
DATA_DIR="/Users/abdulkadirolia/PythonProjects/gutenberg-dataset-files-cleanup/data/"
# [ $# -lt 1 ] && { echo "Usage: $0 <DATA_DIR>"; exit; }
# DATA_DIR=$1

filenames=$(ls $DATA_DIR)
for f in $filenames; do
  echo $f
  curl -H "Content-Type: application/json" -XPOST "localhost:9200/gutenberg2/_bulk?pretty&refresh" --data-binary "@${DATA_DIR}$f"
done

exit 0

