<template>
  <div class="life-cut-container">
    <div v-for="(photo, index) in photos" :key="index" class="life-cut-slot">
      <img v-if="photo" :src="photo" class="life-cut-image" />
      <div v-else class="placeholder">未拍照</div>
      <button v-if="photo" @click="$emit('retakeRequest', index)" class="retake-button">重拍</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({
  photos: Array
})
const emit = defineEmits(['retakeRequest'])
</script>

<style scoped>
.life-cut-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}
.life-cut-slot {
  position: relative;
  border: 2px solid #ccc;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 0 8px rgba(0,0,0,0.2);
  aspect-ratio: 1 / 1;
}
.life-cut-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
  font-size: 18px;
}
.retake-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
}
</style>
