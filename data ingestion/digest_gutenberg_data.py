import numpy as np

import argparse
from os import listdir, path
import json


PATH_TO_PROCESSED_DIR = '/Volumes/Seagate/gutenberg-dataset-files-cleanup/headers_stripped/'
PATH_TO_DIR_CONTAINS_HEADER = '/Volumes/Seagate/Gutenberg datatset/'
OUT_DIR = '/Volumes/Seagate/gutenberg-dataset-files-cleanup/data/'
TITLE = 'Title: '
AUTHOR = 'Author: '

def extract_author_and_title_from_header(filename):
    author = ''
    title = ''
    title_found = False
    author_found = False

    with open(PATH_TO_DIR_CONTAINS_HEADER + filename, "r") as f:
        text = f.read()
        lines = text.splitlines()

        i=0
        for line in lines:
            if i <= 600:
                i+=1

                if TITLE in line:
                    title = line[len(TITLE):]
                    title_found = True
                if AUTHOR in line:
                    author = line[len(AUTHOR):]
                    author_found = True
                if title_found and author_found:
                    break
            else:
                break

    return (author, title)

def build_json_document_to_index(files):
    documents = []
    id = 0
    for filename in files:
        id+=1
        filename_suffix = int(id/100)
        with open(OUT_DIR + f'data{filename_suffix}.json', 'a', encoding='utf-8') as f:
            dataObj = {}
            text = ''

            with open(PATH_TO_PROCESSED_DIR + filename, "r") as infile:
                text = infile.read()
            (author, title) = extract_author_and_title_from_header(filename)
            dataObj["id"] = str(id)
            dataObj["author"] = author
            dataObj["title"] = title
            dataObj["text"] = text

            document = {}
            document["index"] = {}
            document["index"]["_id"] = str(id)
            f.write(json.dumps(document) + "\n")
            f.write(json.dumps(dataObj) + "\n")

            documents.append(document)


def main():
    files_to_process = listdir(PATH_TO_PROCESSED_DIR)[:10000]
    np.random.shuffle(files_to_process)
    build_json_document_to_index(files_to_process)  # First 10,000 files only


if __name__ == "__main__":
    main()
