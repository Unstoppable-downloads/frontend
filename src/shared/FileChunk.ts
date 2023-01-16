export default class FileChunk {
    cid: string   // IPFS Content Identifier of the file part 
    size: Number  // Size of the file part 
    checksum: number  // Checksum 
    sequence:number // sequence number of this file part,
    byteBegin:number
    byteEnd:number
}
