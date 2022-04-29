import type { ExoObject, BaseObjectItem } from '../index'

export type ImageObject = ExoObject<ImageObjectItem>

export interface ImageObjectItem extends BaseObjectItem {
    _name: '画像ファイル'
    file: number
}
