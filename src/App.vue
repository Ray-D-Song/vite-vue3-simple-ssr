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
    <div class="text-xl">{{ num }}</div>
    <button @click="handleClick" class="rounded-sm border border-black">click</button>
    <RouterView />
  </div>
</template>