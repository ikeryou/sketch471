import { Conf } from './core/conf'
import { Contents } from './parts/contents'
import './style.css'

// 複製して追加
const p = document.querySelector('.l-main p') as HTMLElement

const num = Conf.NUM - 1
for(let i = 0; i < num; i++) {
  const clone = p.cloneNode(true) as HTMLElement
  document.querySelector('.l-main > div')?.appendChild(clone)
}

document.querySelectorAll('.l-main p').forEach((el,i) => {
  new Contents({
    el: el,
    key: i,
  })
})


