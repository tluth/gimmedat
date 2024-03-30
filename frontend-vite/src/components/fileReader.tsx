export async function readChunk(file: File, chunkSize: number, offset: number): Promise<ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      // Slice the file to read only the specified chunk
      const blobSlice = file.slice(offset, offset + chunkSize);
  
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as ArrayBuffer);
        } else {
          reject(new Error('Failed to read chunk'));
        }
      };
  
      reader.onerror = () => {
        reject(new Error('Error reading chunk'));
      };
  
      reader.readAsArrayBuffer(blobSlice);
    });
  }