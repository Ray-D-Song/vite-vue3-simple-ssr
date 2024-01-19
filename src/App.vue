<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
	<div class="w-full min-h-screen flex flex-col justify-center items-center">
		<h1 class="text-4xl text-green-800 font-700">
			Simple Vite Vue3 SSR
		</h1>
		<RouterView />
	</div>
</template>
