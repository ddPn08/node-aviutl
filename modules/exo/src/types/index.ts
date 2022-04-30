export * from './known'
export type Exedit = {
    width: number
    height: number
    rate: number
    scale: number
    length: number
    audio_rate: number
    audio_ch: number
}
export type ObjectHeader = {
    start: number
    end: number
    layer: number
    overlay: number
    camera: number
}
export type ObjectFooter = {
    _name: string
    X: number
    Y: number
    Z: number
    拡大率: number
    透明度: number
    回転: number
    blend: number
}
export interface BaseObjectItem {
    _name: string
    [key: string]: string | number
}
export interface ExoObject<T extends ObjectItemType> {
    exedit: Exedit
    '0': ObjectHeader
    '0.0': T
    [key: `0.${number}`]: any
}
export type ObjectItemType = Record<string, string | number>
export type ExoType<T extends ObjectItemType> = {
    keys(): string[]
    toString(): string
    addItem(item: ObjectItemType): void
    deleteItem(key: string): void
    toObject(): ExoObject<T>
} & ExoObject<T>
