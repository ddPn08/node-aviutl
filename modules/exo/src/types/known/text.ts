import type { ExoObject, BaseObjectItem } from '../index'

export type TextObject = ExoObject<TextObjectItem>

export interface TextObjectItem extends BaseObjectItem {
    _name: 'テキスト'
    サイズ: number
    表示速度: number
    文字毎に個別オブジェクト: number
    移動座標上に表示する: number
    自動スクロール: number
    B: number
    I: number
    type: number
    autoadjust: number
    soft: number
    monospace: number
    align: number
    spacing_x: number
    spacing_y: number
    precision: number
    color: string
    color2: number
    font: string
    text: string
}
