<template>
  <button
    :class="[
      'bg-blue-500 hover:bg-blue-600 text-white font-semibold',
      'w-full  text-white  py-2 px-4 rounded-lg ',
      'flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed',
      'transition-all duration-300',
      type === 'success' && 'bg-green-500 hover:bg-green-600',
      type === 'error' && 'bg-red-500 hover:bg-red-600'
    ]"
    :disabled="loading || disabled"
  >
    <svg v-show="loading" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span><slot /> </span>
  </button>
</template>

<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'primary'
  }
})
</script>
