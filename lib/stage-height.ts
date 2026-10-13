// 스크롤 장면의 sticky 무대(h-screen = 100vh) 높이.
// Android 주소창이 나타나고 사라질 때 window.innerHeight는 바뀌지만 100vh는 그대로라서,
// 진행도 계산은 무대와 같은 100vh를 기준으로 해야 장면이 튀지 않습니다.
let probe: HTMLDivElement | null = null

export function stageHeight(): number {
  if (!probe) {
    probe = document.createElement("div")
    probe.setAttribute("aria-hidden", "true")
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none"
    document.body.appendChild(probe)
  }
  return probe.offsetHeight || window.innerHeight
}
