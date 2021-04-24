from os import listdir
from os.path import isfile, join
import json

BOOKS_DIR = "/Users/abdulkadirolia/PythonProjects/gutenberg-dataset-files-cleanup/books/"
OUT_DIR = "/Users/abdulkadirolia/PythonProjects/gutenberg-dataset-files-cleanup/data/"

def main():
    files = [f for f in listdir(BOOKS_DIR) if isfile(join(BOOKS_DIR, f))]
    last_val_in_es = 8000
    for filename in files:
        title, author = filename.split("-")
        author = author.split(".")[0]
        last_val_in_es += 1 # id is 1 after the last entry in ES
        id = str(last_val_in_es)
        text = ''
        with open(BOOKS_DIR + filename, "r") as infile:
            text = infile.read()
        
        build_json_document(author, title, text, id)
        

def build_json_document(author, title, text, id):
    dataObj = {}
    dataObj["id"] = str(id)
    dataObj["author"] = author
    dataObj["title"] = title
    dataObj["text"] = text

    document = {}
    document["index"] = {}
    document["index"]["_id"] = str(id)

    with open(OUT_DIR + "data.json", 'a') as f:
        f.write(json.dumps(document) + "\n")
        f.write(json.dumps(dataObj) + "\n")



if __name__ == "__main__":
    main()