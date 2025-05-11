<template>
  <button
    type="button"
    :class="['button primary icon', size === 'small' ? 'small-button' : 'big-button', { outlined }]"
  >
    <span v-if="text">{{ text }}</span>
    <img
      v-if="icon || iconSrc"
      :src="
        iconSrc || `https://icongr.am/feather/${icon}.svg?size=${iconSize}&amp;color=${iconColor}`
      "
      :alt="icon || 'icon'"
    />
  </button>
</template>

<script setup lang="ts">
defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
  },
  iconSrc: {
    type: String,
  },
  iconSize: {
    type: Number,
    default: 16,
  },
  iconColor: {
    type: String,
    default: '#000000',
  },
  size: {
    type: String,
    default: 'big',
    validator: (value: string) => ['small', 'big'].includes(value),
  },
  outlined: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
span {
  margin-right: 4px;
  line-height: 1.2;
}

button,
button:hover,
button:focus,
button:active {
  transition: var(--transition);
  outline: none !important;
}

button:focus {
  outline: none;
  box-shadow: 0 0 1px var(--outilned-focus-color) !important;
}

button.outlined {
  background-color: var(--input-color) !important;
  border: 1px solid var(--color-grey);
  color: var(--color-primary) !important;
}

button.outlined:hover {
  border: 1px solid var(--color-primary) !important;
}

button.outlined:focus {
  border: 1px solid var(--color-primary) !important;
  box-shadow: 0 0 0 1px var(--outilned-focus-color);
}

.small-button {
  padding: 6px 12px;
}
</style>
