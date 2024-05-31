import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Point } from "../libs/point";
import { MousePointer } from "../core/mousePointer";
import { Conf } from "../core/conf";
import { Func } from "../core/func";
import { Color } from "three";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _tgSVG: SVGElement
  private _tgPath: SVGPathElement
  private _clipID: string
  private _basePoint: Array<Point> = []
  private _itemId: number

  constructor(opt:any) {
    super(opt)

    // input量産
    const num = 10
    for(let i = 0; i < num; i++) {
      const input = document.createElement('input')
      input.type = Util.randomArr(['text', 'password', 'checkbox', 'radio', 'range'])
      input.checked = true
      if(input.type == 'color') {
        const col = new Color(Math.random(), Math.random(), Math.random()).getHexString()
        input.value = '#' + col
      }
      // ランダムな文字列100文字
      if(input.type == 'text') input.value = Math.random().toString(36).slice(-100)
      this.el.appendChild(input)
    }

    this._itemId = opt.key
    this._clipID = 'myClipPath' + this._itemId

    this._tgSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this._tgSVG.classList.add('js-tgSVG')

    const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
    this._tgSVG.appendChild(clip)
    clip.setAttributeNS(null, 'clipPathUnits', 'objectBoundingBox')
    clip.setAttributeNS(null, 'id', this._clipID)

    this._tgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    clip.appendChild(this._tgPath)

    Tween.set(this.el, {
      clipPath: 'url(#' + this._clipID + ')',
    })
    document.body.appendChild(this._tgSVG)
  }


  //
  private _getPathStr(): string {
    this._basePoint[0] = new Point(
      0,
      0,
    )

    this._basePoint[1] = new Point(
      1,
      0,
    )

    this._basePoint[2] = new Point(
      1,
      1
    )

    this._basePoint[3] = new Point(
      0,
      1
    )

    const mx = MousePointer.instance.easeNormal.x
    // const my = MousePointer.instance.easeNormal.x

    let d = ''
    const it = 20
    let i = 0
    const n = 0.005

    const dx = 0
    // const dy = 0

    const sage = Util.map(mx, 0, 1, -1, 1)

    // 上
    // d += 'M ' + (this._basePoint[0].x) + ' ' + (this._basePoint[0].y) + ' '
    for(i = 0; i < it; i++) {
      const offsetX = dx
      const offsetY = 1 * (i % 2 == 0 ? 1 : sage)

      const nx = Util.range(n)
      const ny = Util.range(n)

      if(i == 0) {
        d += 'M ' + (this._basePoint[0].x + offsetX + nx) + ' ' + (this._basePoint[0].y + offsetY + ny) + ' '
      } else {
        const rate = Util.map(i, 0, 1, 0, it - 1)
        const x = Util.mix(this._basePoint[0].x, this._basePoint[1].x, rate)
        const y = this._basePoint[0].y
        d += 'L ' + (x + offsetX + nx) + ' ' + (y + offsetY + ny) + ' '
      }
    }

    // 右
    d += 'L ' + (this._basePoint[1].x) + ' ' + (this._basePoint[1].y) + ' '
    // for(i = 0; i < it; i++) {
    //   const offsetX = -1 * (i % 2 == 0 ? sage : 1)
    //   const offsetY = dy

    //   const nx = Util.range(n)
    //   const ny = Util.range(n)

    //   const rate = Util.map(i, 0, 1, 0, it - 1)
    //   const x = this._basePoint[1].x
    //   const y = Util.mix(this._basePoint[1].y, this._basePoint[2].y, rate)
    //   d += 'L ' + (x + offsetX + nx) + ' ' + (y + offsetY + ny) + ' '
    // }


    // 下
    // d += 'L ' + (this._basePoint[2].x + 0) + ' ' + (this._basePoint[2].y) + ' '
    for(i = 0; i < it; i++) {
      const offsetX = dx
      const offsetY = -1 * (i % 2 == 0 ? 1 : sage)

      const nx = Util.range(n)
      const ny = Util.range(n)

      const rate = Util.map(i, 0, 1, 0, it - 1)
      const x = Util.mix(this._basePoint[2].x, this._basePoint[3].x, rate)
      const y = this._basePoint[2].y
      d += 'L ' + (x + offsetX + nx) + ' ' + (y + offsetY + ny) + ' '
    }

    // 左
    d += 'L ' + (this._basePoint[3].x + 0) + ' ' + (this._basePoint[3].y) + ' '
    // for(i = 0; i < it; i++) {
    //   const offsetX = 1 * (i % 2 != 0 ? sage : 1)
    //   const offsetY = dy

    //   const nx = Util.range(n)
    //   const ny = Util.range(n)

    //   const rate = Util.map(i, 0, 1, 0, it - 1)
    //   const x = this._basePoint[3].x
    //   const y = Util.mix(this._basePoint[3].y, this._basePoint[0].y, rate)
    //   d += 'L ' + (x + offsetX + nx) + ' ' + (y + offsetY + ny) + ' '
    // }

    return d
  }


  protected _update():void {
    super._update()

    if(this._c % 2 == 0) {
      const d = this._getPathStr()
      this._tgPath.setAttributeNS(null, 'd', d)
    }

    const sw = Func.sw()
    const sh = Func.sh()

    const w = sw * 0.8
    const h = Func.val(sw * 0.1, sh * 0.1)

    const radian = Util.radian((MousePointer.instance.easeNormal.x * 90) + (360 / Conf.NUM) * this._itemId)
    const radius = sw * Func.val(0.2, 0.1) * Util.map(MousePointer.instance.easeNormal.x, 0.5, 1, -1, 1)

    const x = (sw * 0.5) + Math.sin(radian) * radius
    const y = (sh * 0.5) + Math.cos(radian) * radius

    const dx = (sw * 0.5) - x
    const dy = (sh * 0.5) - y
    const rot = Util.degree(Math.atan2(dy, dx)) + Util.map(MousePointer.instance.easeNormal.y, 0, 180, -1, 1)

    Tween.set(this.el, {
      width: w,
      height: h,
      rotationZ: rot,
      x: x - w * 0.5,
      y: y - h * 0.5,
      scale: Util.map(MousePointer.instance.easeNormal.y, 0.1, 1, -1, 1),
    })
  }

}