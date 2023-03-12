export const compressArrayBuffer = async (input) => {
    //create the stream
    const cs = new CompressionStream("gzip");
    //create the writer
    const writer = cs.writable.getWriter();

    //write the buffer to the writer
    writer.write(input);
    writer.close();

    //create the output
    const output = [];
    const reader = cs.readable.getReader();
    let totalSize = 0;
    
    //go through each chunk and add it to the output
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      output.push(value);
      totalSize += value.byteLength;
    }
    const concatenated = new Uint8Array(totalSize);
    let offset = 0;

    //finally build the compressed array and return it
    for (const array of output) {
      concatenated.set(array, offset);
      offset += array.byteLength;
    }
    return concatenated;
  };