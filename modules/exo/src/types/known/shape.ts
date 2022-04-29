import type { ExoObject, BaseObjectItem } from '../index'

export type ShapeObject = ExoObject<ShapeObjectItem>

export interface ShapeObjectItem extends BaseObjectItem {
    _name: '図形'
    サイズ: number
    縦横比: number
    ライン幅: number
    type: number
    color: string
    name: number
}
