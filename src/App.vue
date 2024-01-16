<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const num = ref(0)
function handleClick() {
  num.value++
}
</script>

<template>
  <div>
    <div>{{ num }}</div>
    <button @click="handleClick">click</button>
    <RouterView />
  </div>
</template>