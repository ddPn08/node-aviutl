import type { ExoObject, BaseObjectItem } from '../index'

export type AudioObject = ExoObject<AudioObjectItem>

export interface AudioObjectItem extends BaseObjectItem {
    _name: '音声ファイル'
    再生位置: number
    再生速度: number
    ループ再生: number
    動画ファイルと連携: number
    file: number
}
