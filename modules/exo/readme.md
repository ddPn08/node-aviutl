# Exo module

[![npm version](https://img.shields.io/npm/v/@aviutil/exo.svg?style=for-the-badge)](https://www.npmjs.com/package/@aviutil/exo)
[![](https://img.shields.io/npm/l/@aviutil/exo.svg?style=for-the-badge)](https://github.com/ddpn08/node-aviutil/blob/main/LICENSE)

# Usage

## Create exo

```ts
import * as EXO from '@aviutil/exo'

const exo = EXO.create({
    item: {
        _name: 'オブジェクト',
    },
})

const str = exo.toString()
// ->
// [exedit]
// width=1920
// height=1080
// rate=60
// scale=1
// length=1001
// audio_rate=44100
// audio_ch=2
// [0]
// start=1
// end=1001
// layer=1
// overlay=1
// camera=0
// [0.0]
// _name=オブジェクト
// [0.1]
// _name=標準描画
// X=0.0
// Y=450.0
// Z=0.0
// 拡大率=100.00
// 透明度=0.0
// 回転=0.00
// blend=0
```

## Parse exo string

```ts
import * as EXO from '@aviutil/exo'

const str = `[exedit]
width=1920
height=1080
rate=60
scale=1
length=1001
audio_rate=44100
audio_ch=2
[0]
start=1
end=1001
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

const exo = EXO.fromString(str)

console.log(exo['0.0']['_name'])
// -> オブジェクト
```
