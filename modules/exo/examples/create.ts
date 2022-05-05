import { EXO } from '..'

const exo = EXO.create({
    exedit: {
        width: 1920,
        height: 1080,
        rate: 60,
        scale: 1,
        length: 10,
        audio_rate: 44100,
        audio_ch: 2,
    },
    items: [
        {
            '0': {
                start: 1,
                end: 2,
                layer: 1,
                overlay: 1,
                camera: 1,
            },
            '0.0': {
                _name: 'オブジェクト',
            },
            '0.1': {
                _name: '標準描画',
                X: 0.0,
                Y: 0.0,
                Z: 0.0,
                拡大率: 1.0,
                透明度: 0,
                回転: 0,
                blend: 0,
            },
        },
    ],
})

console.log(exo.toString())
// ->
// [exedit]
// width=1920
// height=1080
// rate=60
// scale=1
// length=10
// audio_rate=44100
// audio_ch=2
// [0]
// start=1
// end=2
// layer=1
// overlay=1
// camera=1
// [0.0]
// _name=オブジェクト
// [0.1]
// _name=標準描画
// X=0
// Y=0
// Z=0
// 拡大率=100
// 透明度=0
// 回転=0
// blend=0
