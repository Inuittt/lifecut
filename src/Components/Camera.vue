<template>
  <div class="camera-container">
    <video ref="video" autoplay playsinline class="camera-preview" />
    <div v-if="countdown > 0" class="countdown">{{ countdown }}</div>
    <button @click="startCountdown" class="shoot-button">📸 拍照</button>
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
let stream = null

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

  // 左右翻转
  context.translate(canvas.width, 0)
  context.scale(-1, 1)
  context.drawImage(video.value, 0, 0, canvas.width, canvas.height)

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
</style>
