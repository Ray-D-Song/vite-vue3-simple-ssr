<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Home')
</script>

<template>
  <h1 class="text-blue">{{ title }}</h1>
</template>