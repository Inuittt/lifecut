<template>
  <div class="app-container">
    <Camera
      v-if="showCamera"
      :targetIndex="targetIndex"
      @photoTaken="handlePhotoTaken"
    />
    <LifeCut
      :photos="photos"
      @retakeRequest="handleRetakeRequest"
    />
    <button v-if="!showCamera" @click="startNextShot" class="start-button">
      📸 开始拍摄
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Camera from './components/Camera.vue'
import LifeCut from './components/LifeCut.vue'

const photos = ref([null, null, null, null])
const showCamera = ref(false)
const targetIndex = ref(0)

function startNextShot() {
  // 查找下一个未填充格子
  const nextIndex = photos.value.findIndex(p => !p)
  targetIndex.value = nextIndex !== -1 ? nextIndex : 0
  showCamera.value = true
}

function handlePhotoTaken({ photoData, index }) {
  photos.value[index] = photoData
  showCamera.value = false
}

function handleRetakeRequest(index) {
  targetIndex.value = index
  showCamera.value = true
}
</script>

<style scoped>
.app-container {
  padding: 24px;
  max-width: 500px;
  margin: auto;
  text-align: center;
}
.start-button {
  margin-top: 16px;
  padding: 16px;
  border-radius: 12px;
  background: #03a9f4;
  color: white;
  font-size: 20px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}
.start-button:hover {
  transform: scale(1.05);
}
</style>

