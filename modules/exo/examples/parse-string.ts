import { EXO } from '../src'

const str = `[exedit]
width=1920
height=1080
rate=60
scale=1
length=10
audio_rate=44100
audio_ch=2
[0]
start=1
end=2
layer=1
overlay=1
camera=0
[0.0]
_name=オブジェクト
[0.1]
_name=標準描画
X=0.0
Y=450.0
Z=0.0
拡大率=100.00
透明度=0.0
回転=0.00
blend=0
`

const exo = EXO.parse(str)

console.log(exo.items[0]['0.0']['_name'])

console.log(exo.toJSON())
// -> オブジェクト
