<template>
  <div class="camera-container">
    <video 
      ref="video" 
      autoplay 
      playsinline 
      class="camera-preview flipped" 
      :class="currentFilter" 
    />
    <div v-if="countdown > 0" class="countdown">{{ countdown }}</div>
    <div class="controls">
      <div class="filter-selector">
        <button 
          v-for="filter in filters" 
          :key="filter.name"
          @click="currentFilter = filter.name"
          :class="{ active: currentFilter === filter.name }"
          class="filter-button"
        >
          {{ filter.label }}
        </button>
      </div>
      <button @click="startCountdown" class="shoot-button">📸 拍照</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['photoTaken'])
const props = defineProps({
  targetIndex: Number
})

const video = ref(null)
const countdown = ref(0)
const currentFilter = ref('normal')
let stream = null

const filters = [
  { name: 'normal', label: '原图' },
  { name: 'grayscale', label: '黑白' },
  { name: 'sepia', label: '复古' },
  { name: 'vintage', label: '怀旧' },
  { name: 'cool', label: '冷色' },
  { name: 'warm', label: '暖色' }
]

onMounted(() => {
  startCamera()
})
onUnmounted(() => {
  stopCamera()
})

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    .then(s => {
      stream = s
      video.value.srcObject = stream
    })
}
function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}
function startCountdown() {
  countdown.value = 3
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(timer)
      takePhoto()
    }
  }, 1000)
}
function takePhoto() {
  const canvas = document.createElement('canvas')
  canvas.width = video.value.videoWidth
  canvas.height = video.value.videoHeight
  const context = canvas.getContext('2d')

  // 直接进行翻转
  context.translate(canvas.width, 0)
  context.scale(-1, 1)
  context.drawImage(video.value, 0, 0, canvas.width, canvas.height)

  // 应用滤镜
  if (currentFilter.value !== 'normal') {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    switch (currentFilter.value) {
      case 'grayscale':
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
          data[i] = avg
          data[i + 1] = avg
          data[i + 2] = avg
        }
        break
      case 'sepia':
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189))
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168))
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131))
        }
        break
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] * 0.7
          data[i + 1] = data[i + 1] * 0.7
          data[i + 2] = data[i + 2] * 0.7
          data[i + 1] += 20
        }
        break
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] * 0.8
          data[i + 2] = data[i + 2] * 1.2
        }
        break
      case 'warm':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = data[i] * 1.2
          data[i + 1] = data[i + 1] * 1.1
          data[i + 2] = data[i + 2] * 0.8
        }
        break
    }
    context.putImageData(imageData, 0, 0)
  }

  const photoData = canvas.toDataURL('image/png')
  emit('photoTaken', { photoData, index: props.targetIndex })
}
</script>

<style scoped>
.camera-container {
  position: relative;
  text-align: center;
  padding: 16px;
}
.camera-preview {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
}
.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 72px;
  color: white;
  text-shadow: 0 0 10px black;
}
.shoot-button {
  margin-top: 12px;
  padding: 16px;
  border-radius: 50%;
  font-size: 24px;
  border: none;
  background: #ff4081;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transition: transform 0.2s;
}
.shoot-button:hover {
  transform: scale(1.1);
}

.controls {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.filter-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-button {
  padding: 8px 12px;
  border-radius: 8px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button.active {
  background: #03a9f4;
  color: white;
}

.filter-button:hover {
  transform: scale(1.05);
}

/* 滤镜效果 */
.grayscale {
  filter: grayscale(100%);
}

.sepia {
  filter: sepia(100%);
}

.vintage {
  filter: sepia(50%) brightness(80%);
}

.cool {
  filter: brightness(90%) saturate(120%) hue-rotate(10deg);
}

.warm {
  filter: brightness(110%) saturate(120%) hue-rotate(-10deg);
}

.camera-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.control-button {
  padding: 8px 16px;
  border-radius: 8px;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.control-button:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

.flipped {
  transform: scaleX(-1);
}
</style>
