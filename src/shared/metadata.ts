
export default class MetaData{
    fileName: string
    uid:string
    fileSize: number
    chunks: Array<FileChunk>
    hash: string
    categories: Array<string>
}