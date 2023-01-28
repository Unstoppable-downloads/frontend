import FileChunk from "./FileChunk";

export default class MetaData {
    title: string
    fileName: string
    uid:string
    fileSize: number
    chunks: Array<FileChunk>
    hash: string
    imdb: string
    categories: Array<string>
    description: string
}