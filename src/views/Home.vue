<script setup lang="ts">
import { ref } from 'vue'

const title = ref('HomePage')
</script>

<template>
	<div class="text-2xl mt-10 font-500">
		{{ title }}
	</div>
</template>
