import requests
import json 
import sys 
import os 

# url = "http://localhost:5000/file"
# body = {
#     "file_name": "__init__.py",
#     "byte_size": 1000,
#     "file_type": "text/plain"
# }

# r = requests.post(url, data=json.dumps(body))
# print(r.json())

url = "https://gimmedat-dev-file-storage.s3.amazonaws.com/1192a973-7acc-4840-b3fb-212dc5c5999e/Screenshot%20from%202024-03-19%2015-05-01.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYM2GYX3Y65NFHAFB%2F20240323%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240323T221343Z&X-Amz-Expires=60&X-Amz-SignedHeaders=content-type%3Bhost%3Bx-amz-acl&X-Amz-Signature=8273bf0cb9f78f3f71df1efad5af8cfa7358266d4754ab0c0c0add50c4c5c49b"


def progress_bar(comment, percent, bar_len=50):
    """
    prints progress of uploads and what not

    :type comment: string
    :param comment: a comment that will prefix the progress bar

    """
    sys.stdout.write("\r")
    progress = ""
    for i in range(bar_len):
        if i < int(bar_len * percent):
            progress += "="
        else:
            progress += " "
    sys.stdout.write(" %s [ %s ] %.2f%%" % (comment, progress, percent * 100))
    sys.stdout.flush()
    sys.stdout.write("\r")


class ChunkUpload(object):
    """
    Upload your model in chunks rather than
    trying to read entire thing into memory
    """

    def __init__(self, filename, chunksize=1 << 13):
        self.filename = filename
        self.chunksize = chunksize
        self.totalsize = os.path.getsize(filename)
        self.readsofar = 0

    def __iter__(self):
        with open(self.filename, "rb") as file:
            while True:
                data = file.read(self.chunksize)
                if not data:
                    sys.stderr.write("\n")
                    break
                self.readsofar += len(data)
                percent = self.readsofar * 1e2 / self.totalsize
                progress_bar("Uploading", percent / 100)
                yield data

    def __len__(self):
        return self.totalsize


class IterableToFileAdapter(object):
    """
    Iterator for uploading your model in chunks
    rather than trying to read entire thing into memory
    """

    def __init__(self, iterable):
        self.iterator = iter(iterable)
        self.length = len(iterable)

    def read(self, size=-1):
        return next(self.iterator, b"")

    def __len__(self):
        return self.length

def handle_upload(presigned_url, filename):
    """Uploads your archived studyfolder to s3"""

    it = ChunkUpload(filename, 1000)
    headers = {"Content-Type": "application/zip", "x-amz-acl": "private"}
    response = requests.put(presigned_url, data=IterableToFileAdapter(it))
    return response

r = handle_upload("https://gimmedat-dev-file-storage.s3.amazonaws.com/7f43265e-2fe1-429d-b47f-2ade58e691e8/foo.py?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAYM2GYX3Y65NFHAFB%2F20240323%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20240323T223227Z&X-Amz-Expires=60&X-Amz-SignedHeaders=content-type%3Bhost%3Bx-amz-acl&X-Amz-Signature=c20150682fa86945f15f82d7b1e62cb678255d15e2af5007d3eb0a34feb5878d", "foo.py")
print(r.status_code)