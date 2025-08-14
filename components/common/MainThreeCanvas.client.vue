<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

const props = defineProps({
  data: { type: Array, default: () => [] }
})

// 容器的引用，用於獲取 DOM 元素
const container = ref(null)
// Vue Router 實例，用於導航
const router = useRouter()

// Three.js 和物理模擬相關的核心變數
let scene, camera, labelRenderer, animId
let width = 0, height = 0, containerRect
let R_MIN = 16, R_MAX = 40

// ===== 物理參數 =====
const SPEED_BASE = 150 // 基礎速度
const CENTER_K = 0.2 // 較小的中心吸引力，讓它們不會跑出畫面太遠
const DRAG_PER_SEC = 0.2 // 降低阻力，讓它們能漂浮更久
const RESTITUTION_BALL = 0.2 // 球與球之間的彈性碰撞係數
const RESTITUTION_WALL = 0.2 // 提高牆壁彈性係數，讓它們能彈開
const SUBSTEPS = 2
const STOP_EPS = 10 // 停止速度閾值
const BG_COLOR = 0xffffff

const BIAS_TOP_N = 1 // 出生偏置：前 N 顆球會盡量靠近中心出生

// ----------------------------------------------------
// Ball 類別：定義每個球體的物理屬性和 DOM 元素
// ----------------------------------------------------
class Ball {
  r = 24; m = 1
  obj; el; labelEl; v = new THREE.Vector2()
  sizeT = Math.random()
  speedFactor = 0.7 + Math.random() * 0.6
  route = ''
  constructor(opts) { Object.assign(this, opts); this.m = this.r * this.r }
}
const balls = []

// ---- 拖曳狀態 ----
const dragging = {
  ball: null, // 當前被拖曳的球體
  pointerId: null, // 拖曳指標的唯一 ID
  lastWorld: new THREE.Vector2(), // 上一次拖曳位置的世界坐標
  offset: new THREE.Vector2(),  // 拖曳點與球體中心點的偏移量
  lastTS: 0,  // 上一次拖曳的時間戳
  moved: false  // 標記拖曳過程中是否有明顯移動
}

// ----------------------------------------------------
// 分析資料中的 time 次數範圍，找出最大值和最小值
// ----------------------------------------------------
let timeRange = {
  min: 0, // 次數範圍最小值
  max: 1, // 次數範圍最大值
  has: false // 是否有有效數據
}
function analyzeTime(items) {
  const vals = items.map(i => Number(i?.time)).filter(n => Number.isFinite(n))
  if (!vals.length) return { min: 0, max: 1, has: false }
  const min = Math.min(...vals), max = Math.max(...vals)
  return { min, max, has: true }
}

// ----------------------------------------------------
// 用來調整大小分佈的非線性比例
// 將 timeRange 轉換為 0 到 1 之間的大小比例
// ----------------------------------------------------
const GAMMA = 1.0
function timeToSizeT(time) {
  if (!timeRange.has || !Number.isFinite(time)) return Math.random()
  const { min, max } = timeRange
  const base = max === min ? 0.5 : (time - min) / (max - min)
  return Math.pow(THREE.MathUtils.clamp(base, 0, 1), GAMMA)
}

// 根據容器寬度計算球體半徑的範圍
function radiusRangeForWidth(w) {
  // value = 計算出來的比例
  // minLimit = 16 → 最小不能小於 16px 半徑
  // maxLimit = 40 → 最大不能大於 40px 半徑
  const min = THREE.MathUtils.clamp(Math.round(w * 0.045), 16, 40)
  
  const maxRaw = Math.round(w * 0.045)
  const max = THREE.MathUtils.clamp(maxRaw, min + 10, 120)
  return { R_MIN: min, R_MAX: max }
}

// ----------------------------------------------------
// 建立球體的 DOM 元素
// @param {object} { 半徑 r, 標籤文字 label, 路由 route } 
// ----------------------------------------------------
function createCircleElement({ r, label }) {
  // 圓形容器
  const el = document.createElement('div')
  el.style.cssText = `
    position:relative;
    width:${r * 3}px;
    height:${r * 3}px;
    border-radius:9999px;
    pointer-events:auto;
    touch-action:none;
  `
  //  /* 玻璃擬態效果 */
  //   background: rgba(255, 255, 255, 0.1); /* 半透明白色背景 */
  //   backdrop-filter: blur(15px); /* 毛玻璃模糊效果 */
  //   -webkit-backdrop-filter: blur(10px); /* 兼容 Safari */
  //   border: 1px solid rgba(255, 255, 255, 0.9); /* 淡邊框 */
  //   /* 立體陰影效果 */
  //   box-shadow:
  //     inset 0 -4px 10px rgba(0, 0, 0, 0.1), /* 內陰影 */
  //     0 4px 12px rgba(0, 0, 0, 0.2); /* 外陰影 */

  // 置中文字
  const labelEl = document.createElement('div')
  labelEl.textContent = label ?? ''
  labelEl.style.cssText = `
    position:absolute; 
    inset:0;
    display:flex; 
    align-items:center; 
    justify-content:center;
    font-weight:800;
    letter-spacing:.5px;
    text-align:center;
    pointer-events:none;
    color:rgba(20,20,20,0.85);
    text-shadow:0 5px 5 rgba(255,255,255,0.85);
    font-size:${Math.round( r / 2 )}px;
  `
  el.appendChild(labelEl)

  return { el, labelEl }
}
// ----------------------------------------------------
// 產生一個「隨機且不與已放置物件重疊」的位置（均勻分布）
// placed：已放置物件的陣列（每個元素至少有 x, y, r）
// r：圓形半徑
// ----------------------------------------------------
function randomNonOverlapPosition(placed, r) {
  // 以容器寬高與半徑，計算可用的邊界（確保整顆球都在畫面內）
  const left = -width / 2 + r
  const right = width / 2 - r
  const top = height / 2 - r
  const bottom = -height / 2 + r
  // 最多嘗試 800 次隨機取樣（避免極端情況下的無限迴圈）
  for (let t = 0; t < 800; t++) {
    // 在可用範圍內均勻隨機取一個候選位置
    const x = THREE.MathUtils.randFloat(left, right)
    const y = THREE.MathUtils.randFloat(bottom, top)

    // 檢查是否與任何已放置物件重疊
    let ok = true
    for (const p of placed) {
      // 與已放置物件中心距離（平方）
      // 兩圓不重疊的條件：中心距離 >= 半徑和
      const dx = x - p.x, dy = y - p.y
      const minD = r + p.r + 2 // +2 做「安全間隙」，避免邊緣剛好貼住造成抖動
      if (dx * dx + dy * dy < minD * minD) { ok = false; break }
    }
    // 沒重疊就確定這個位置：記錄到 placed 並回傳
    if (ok) { placed.push({ x, y, r }); return [x, y] }
  }
  // 如果嘗試失敗把球放在區域中心
  const x = (left + right) / 2, y = (bottom + top) / 2
  placed.push({ x, y, r }); return [x, y]
}

// 產生一個符合常態分佈的隨機數（Box-Muller 轉換）
function randNormal() {
  let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

// 產生一個靠近中心且不重疊的位置
function nearCenterNonOverlap(placed, r) {
  const left = -width / 2 + r
  const right = width / 2 - r
  const top = height / 2 - r
  const bottom = -height / 2 + r
  const maxSpan = Math.min(width, height) * 0.45
  for (let tries = 0; tries < 1000; tries++) {
    const t = tries / 1000
    const sigma = 20 + t * maxSpan * 0.5
    let x = randNormal() * sigma
    let y = randNormal() * sigma
    x = THREE.MathUtils.clamp(x, left, right)
    y = THREE.MathUtils.clamp(y, bottom, top)
    let ok = true
    for (const p of placed) {
      const dx = x - p.x, dy = y - p.y, minD = r + p.r + 2
      if (dx * dx + dy * dy < minD * minD) { ok = false; break }
    }
    if (ok) { placed.push({ x, y, r }); return [x, y] }
  }
  return randomNonOverlapPosition(placed, r)
}

// ---- 指標轉換/邊界夾限 ----
// 將螢幕坐標轉換為世界坐標
function screenToWorld(clientX, clientY) {
  const sx = clientX - containerRect.left
  const sy = clientY - containerRect.top
  return { x: sx - width / 2, y: height / 2 - sy }
}
// 將給定的坐標夾限在可見範圍內
function clampToBounds(x, y, r) {
  const left = -width / 2 + r, right = width / 2 - r
  const top = height / 2 - r, bottom = -height / 2 + r
  return {
    x: THREE.MathUtils.clamp(x, left, right),
    y: THREE.MathUtils.clamp(y, bottom, top)
  }
}

// ----------------------------------------------------
// 初始化 Three.js 場景、攝影機、渲染器，並生成所有球體
// ----------------------------------------------------
function setupScene() {
  const colorMode = useColorMode()
  scene = new THREE.Scene()

  // 獲取容器尺寸
  width = container.value.clientWidth
  height = container.value.clientHeight
  containerRect = container.value.getBoundingClientRect()
    // 根據容器寬度計算半徑範圍
    ; ({ R_MIN, R_MAX } = radiusRangeForWidth(width))
  // 用 BG_COLOR 當容器背景（可改成任意色或漸層）
  const bg = `#${new THREE.Color(BG_COLOR).getHexString()}`
  console.log(colorMode.value)
  container.value.style.background =  bg 


  // 設定正交攝影機
  camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -10, 10)
  camera.position.z = 5

  // 初始化 CSS2D 渲染器，用於渲染 DOM 元素
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(width, height)
  Object.assign(labelRenderer.domElement.style, {
    position: 'absolute', top: '0', left: '0', pointerEvents: 'none'
  })
  container.value.appendChild(labelRenderer.domElement)

  // 生成圓形 DOM
  const placed = [] // 存放已放置球體的位置，用於避免重疊
  const items = Array.isArray(props.data) ? props.data : []
  const count = items.length > 10 ? 10 : items.length || 8 // 最多生成 10 顆球體, 沒資料則生成 8 顆空白
  timeRange = analyzeTime(items) // 分析資料中的 time 次數範圍

  // 依據 sizeT 和半徑由大到小排序，
  // 讓大球先生成，避免被小球擠出
  const spawnList = []
  for (let i = 0; i < count; i++) {
    const item = items[i] ?? {}
    const sizeT =
      Number.isFinite(Number(item.time)) ? timeToSizeT(Number(item.time))
        : (typeof item.size === 'number' ? THREE.MathUtils.clamp(item.size, 0, 1) : Math.random())
    const r = THREE.MathUtils.lerp(R_MIN, R_MAX, sizeT)
    spawnList.push({ item, sizeT, r })
  }
  spawnList.sort((a, b) => b.r - a.r)

  // 創建並放置每個球體
  for (let i = 0; i < spawnList.length; i++) {
    const { item, sizeT, r } = spawnList[i]
    const { el, labelEl } = createCircleElement({ r, label: item.label, route: item.route })

    const obj = new CSS2DObject(el)
    // BIAS_TOP_N 顆球會盡量靠近中心出生，其餘隨機分布
    const [x, y] = (i < BIAS_TOP_N) ? nearCenterNonOverlap(placed, r)
      : randomNonOverlapPosition(placed, r)
    obj.position.set(x, y, 0)
    scene.add(obj)

    // 設定初速，讓球體偏向右側移動
    const ang = Math.random() * Math.PI * 2 // 角度範圍從 0 到 360 度
    const speedFactor = 0.7 + Math.random() * 0.6
    const speed = SPEED_BASE * speedFactor * (R_MIN / r)
    const v = new THREE.Vector2(Math.cos(ang) * speed, Math.sin(ang) * speed)

    // 建立 Ball 實例並儲存
    const ball = new Ball({ r, el, obj, v, sizeT, speedFactor, route: item.route ?? '', labelEl })
    balls.push(ball)
    // 為每個球體綁定拖曳事件
    bindPointerHandlers(ball)
  }
}

// ----------------------------------------------------
// 綁定(ball)的指標事件：拖曳、移動、放開、取消
// @param {Ball} ball - 要綁定事件的球體實例
// ----------------------------------------------------
function bindPointerHandlers(ball) {
  const onDown = (e) => {
    e.preventDefault() // 阻止瀏覽器的預設行為（避免選字、滾動等影響拖曳）
    // 記錄容器在視窗中的位置，之後把 client 座標轉成世界座標要用
    containerRect = container.value.getBoundingClientRect()

    // 設定拖曳狀態：目前正在被拖的是哪顆球、指標ID等
    dragging.ball = ball
    dragging.pointerId = e.pointerId
    dragging.moved = false // 先假設是點擊，移動夠大才視為拖曳
    dragging.lastTS = e.timeStamp // 上一次事件時間（毫秒）

    // 以容器中心為原點的座標系
    const wp = screenToWorld(e.clientX, e.clientY)
    dragging.lastWorld.set(wp.x, wp.y) // 記錄上次座標
    dragging.offset.set( // 計算指標相對球心的位移
      wp.x - ball.obj.position.x,
      wp.y - ball.obj.position.y
    )
    ball.el.style.cursor = 'grabbing' // 游標 抓取style
    ball.el.setPointerCapture(e.pointerId) // 捕捉指標，事件仍會派發到這個元素
  }

  // 更新球的位置與速度（在拖曳狀態下）
  const onMove = (e) => {
    if (!dragging.ball || dragging.ball !== ball) return
    const wp = screenToWorld(e.clientX, e.clientY) // 座標
    // 計算與上次事件的時間差（秒），下限 1ms 避免除以 0
    const dt = Math.max(0.001, (e.timeStamp - dragging.lastTS) / 1000)
    // 不讓物體瞬移到指標中心：維持當初按下時的偏移量
    const tx = wp.x - dragging.offset.x
    const ty = wp.y - dragging.offset.y
    // 夾限在場景邊界內
    const c = clampToBounds(tx, ty, ball.r)
    // 用「位移 / 時間」估算速度，保留拋擲的動量感
    // 這樣放開的瞬間，球會以最後的拖曳速度繼續前進
    ball.v.set(
      (c.x - ball.obj.position.x) / dt, (c.y - ball.obj.position.y) / dt
    )

    // 位置設定到目標點（dragging 中不受中心力/阻力影響）
    ball.obj.position.set(c.x, c.y, 0)
    // 判斷是否發生了足夠的移動，判斷是否「真的拖動」：位移大於 ~3px 
    if (!dragging.moved) {
      const dx = wp.x - dragging.lastWorld.x, dy = wp.y - dragging.lastWorld.y
      if (dx * dx + dy * dy > 9) dragging.moved = true  // 3px 門檻（3^2 = 9）
    }
    // 更新「上一次」的座標與時間
    dragging.lastWorld.set(wp.x, wp.y)
    dragging.lastTS = e.timeStamp
  }

  // 結束拖曳；若沒有移動則視為點擊（導頁）
  const onUp = (e) => {
    if (!dragging.ball || dragging.ball !== ball) return
    ball.el.style.cursor = 'grab'
    ball.el.releasePointerCapture(e.pointerId)

    // 沒拖動（moved = false 當作「點擊」
    if (!dragging.moved && ball.route) {
      const r = String(ball.route)
      if (/^https?:\/\//.test(r)) window.open(r, '_blank')
      else router.push(r)
    }
    // 清空拖曳狀態
    dragging.ball = null
    dragging.pointerId = null
  }
  ball.el.addEventListener('pointerdown', onDown)   // 按下：開始拖曳
  ball.el.addEventListener('pointermove', onMove)   // 移動：跟手 & 更新速度
  ball.el.addEventListener('pointerup', onUp)       // 放開：結束拖曳/點擊
  ball.el.addEventListener('pointercancel', onUp)   // 取消：視同放開（如來電/視窗切換）
}

// ----------------------------------------------------
// 處理視窗大小改變事件，重新計算並更新所有球體的尺寸和位置
// ----------------------------------------------------
function onResize() {
  // 更新容器尺寸
  width = container.value.clientWidth
  height = container.value.clientHeight
  containerRect = container.value.getBoundingClientRect()
  labelRenderer.setSize(width, height)
  // 更新攝影機視口
  camera.left = -width / 2; camera.right = width / 2
  camera.top = height / 2; camera.bottom = -height / 2
  camera.updateProjectionMatrix()
    // 重新計算半徑範圍
    ; ({ R_MIN, R_MAX } = radiusRangeForWidth(width))

  // 針對每個球體進行更新
  for (const b of balls) {
    const newR = THREE.MathUtils.lerp(R_MIN, R_MAX, b.sizeT)
    b.r = newR; b.m = newR * newR
    b.el.style.width = `${newR * 2}px`
    b.el.style.height = `${newR * 2}px`
    b.el.style.borderRadius = '9999px'

    // 將計算出的基礎字體大小存起來，供動畫使用
    b.baseFontSize = Math.round(newR * 0.3)
    b.labelEl.style.fontSize = `${b.baseFontSize}px`

    const dir = b.v.lengthSq() ? b.v.clone().normalize() : new THREE.Vector2(1, 0)
    const newMag = SPEED_BASE * b.speedFactor * (R_MIN / newR)
    b.v.copy(dir.multiplyScalar(newMag))

    const c = clampToBounds(b.obj.position.x, b.obj.position.y, newR)
    b.obj.position.set(c.x, c.y, 0)
  }

  // 重新渲染一次
  labelRenderer.render(scene, camera)
}

// ----------------------------------------------------
// 元件掛載後，初始化場景並啟動循環
// ----------------------------------------------------
onMounted(() => {
  setupScene()
  window.addEventListener('resize', onResize)

  const clock = new THREE.Clock() // 用於計時，確保物理模擬的穩定性
  const maxDt = 0.03 // 最大時間步長

  const tick = () => {
    // 計算自上一幀以來經過的時間
    const dt = Math.min(clock.getDelta(), maxDt)
    const h = dt / SUBSTEPS

    // 物理模擬循環（子步進）
    for (let s = 0; s < SUBSTEPS; s++) {
      for (const b of balls) {
        // 如果球體正在被拖曳，則跳過物理計算
        if (dragging.ball === b) continue
        // 計算中心吸引力
        const ax = -CENTER_K * b.obj.position.x
        const ay = -CENTER_K * b.obj.position.y
        b.v.x += ax * h
        b.v.y += ay * h
        // 計算空氣阻力
        const drag = Math.exp(-DRAG_PER_SEC * h)
        b.v.multiplyScalar(drag)
        // 速度小於閾值時，設為靜止
        if (b.v.lengthSq() < STOP_EPS * STOP_EPS) b.v.set(0, 0)
        // 更新位置
        b.obj.position.x += b.v.x * h
        b.obj.position.y += b.v.y * h
      }
      // 處理牆壁碰撞
      wallCollisions()
      // 處理球體之間的碰撞
      ballCollisions()
    }

    labelRenderer.render(scene, camera)
    animId = requestAnimationFrame(tick)
  }
  tick()
})

// ----------------------------------------------------
// 處理球體與容器邊界的碰撞和反彈
// ----------------------------------------------------
function wallCollisions() {
  for (const b of balls) {
    const r = b.r + 30
    const left = -width / 2 + r 
    const right = width / 2 - r 
    const top = height / 2 - r
    const bottom = -height / 2 + r
    const p = b.obj.position
    // 檢查左右牆壁
    if (p.x <= left) { p.x = left; b.v.x = -b.v.x * RESTITUTION_WALL }
    else if (p.x >= right) { p.x = right; b.v.x = -b.v.x * RESTITUTION_WALL }
    // 檢查上下牆壁
    if (p.y >= top) { p.y = top; b.v.y = -b.v.y * RESTITUTION_WALL }
    else if (p.y <= bottom) { p.y = bottom; b.v.y = -b.v.y * RESTITUTION_WALL }
  }
}

// ----------------------------------------------------
// 處理球體與球體之間的碰撞，包含解穿透和動量交換
// ----------------------------------------------------
function ballCollisions() {
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      const A = balls[i], B = balls[j]
      const pa = A.obj.position, pb = B.obj.position
      const dx = pb.x - pa.x, dy = pb.y - pa.y
      const minD = A.r * 1.5 + B.r
      const distSq = dx * dx + dy * dy
      if (distSq >= minD * minD) continue // 如果沒有重疊，則跳過

      const dist = Math.sqrt(distSq) || 0.0001
      const nx = dx / dist, ny = dy / dist // 法線向量

      // 解穿透：將球體推開，使其不再重疊
      const overlap = (minD - dist)
      const aDrag = dragging.ball === A
      const bDrag = dragging.ball === B
      if (aDrag && !bDrag) { // 如果 A 被拖曳，只推開 B
        pb.x += nx * overlap; pb.y += ny * overlap
      } else if (!aDrag && bDrag) { // 如果 B 被拖曳，只推開 A
        pa.x -= nx * overlap; pa.y -= ny * overlap
      } else { // 兩顆都沒被拖曳，各推開一半
        pa.x -= nx * overlap * 0.5; pa.y -= ny * overlap * 0.5
        pb.x += nx * overlap * 0.5; pb.y += ny * overlap * 0.5
      }

      // 彈性碰撞（動量守恆）
      const relVn = (A.v.x - B.v.x) * nx + (A.v.y - B.v.y) * ny
      if (relVn >= 0) continue // 如果兩球正在遠離，則不需處理
      const invMassSum = 1 / A.m + 1 / B.m
      const jVn = -(1 + RESTITUTION_BALL) * relVn / invMassSum
      // 根據動量交換更新速度
      A.v.x += -(jVn / A.m) * nx; A.v.y += -(jVn / A.m) * ny
      B.v.x += (jVn / B.m) * nx; B.v.y += (jVn / B.m) * ny
    }
  }
}

// ----------------------------------------------------
// 元件卸載前，清除所有事件監聽和動畫，避免記憶體洩漏
// ----------------------------------------------------
onBeforeUnmount(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', onResize)
  labelRenderer?.domElement?.remove()
})
</script>

<template>
  <div ref="container" class="wrap" />
</template>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
}
</style>
```