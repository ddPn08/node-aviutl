import type { ExoObject, BaseObjectItem } from '../index'

export type VideoObject = ExoObject<VideoObjectItem>

export interface VideoObjectItem extends BaseObjectItem {
    _name: '動画ファイル'
    再生位置: number
    再生速度: number
    ループ再生: number
    アルファチャンネルを読み込む: number
    file: number
}
