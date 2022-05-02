export type ItemType = Record<string, string | number>
export type Exedit = {
    width: number
    height: number
    rate: number
    scale: number
    length: number
    audio_rate: number
    audio_ch: number
    alpha?: number
    name?: string
}
export type ItemHeader = {
    start: number
    end: number
    layer: number
    overlay: number
    camera: number
    group?: number
}
export type ItemFooter = {
    _name: string
    X: number
    Y: number
    Z: number
    拡大率: number
    透明度: number
    回転: number
    blend: number
}
export interface ItemObject {
    [key: string]: string | number
}
export interface BaseItem {
    [key: `${number}`]: ItemHeader | ItemObject
    [key: `${number}.${number}`]: ItemObject | ItemFooter
}
export interface ExoObject {
    exedit: Exedit
    [key: number]: ItemHeader
    [key: `${number}.${number}`]: ItemObject | ItemFooter
}
