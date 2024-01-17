<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const num = ref(0)
function handleClick() {
  num.value++
}

const router = useRouter()
function handleGoAbout() {
  router.push({
    name: 'about'
  })
}
</script>

<template>
  <div>
    <div class="text-xl">{{ num }}</div>
    <button @click="handleClick" class="rounded-sm border border-black">click</button>
    <button @click="handleGoAbout">Go About</button>
    <RouterView />
  </div>
</template>