<template>
  <div class="language-switcher">
    <button @click="switchLanguage" :data-active="locale">
      <div class="language-switcher-buttons-container">
        <div class="language-switcher-button">EN</div>
        <div class="language-switcher-button">PL</div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'

const { locale } = useI18n()

onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    locale.value = savedLocale
  }
})

const switchLanguage = () => {
  locale.value = locale.value === 'en' ? 'pl' : 'en'
  localStorage.setItem('locale', locale.value)
}
</script>

<style scoped>
.language-switcher {
  position: absolute;
  top: auto;
  bottom: 8px;
  right: 8px;
  left: auto;
  box-shadow: 0 0 12px var(--column-shadow-color);

  @media (max-width: 900px) {
    bottom: auto;
    top: 8px;
    left: 8px;
    right: auto;
  }

  button {
    position: relative;
    display: flex;
    padding: 4px;
    border-radius: 4px !important;
    background: var(--columnBgC);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      opacity: 1;
    }

    &:active {
      transform: scale(1);
    }

    div.language-switcher-buttons-container {
      display: flex;
      gap: 2px;
      background-color: var(--input-color);
      border-radius: 4px;
      border: 1px solid var(--color-grey);
      box-sizing: content-box;
    }

    div.language-switcher-button {
      position: relative;
      z-index: 1;
      padding: 4px 8px;
      border-radius: 16px;
      transition: color 0.3s ease;
      font-weight: 500;
      font-size: 14px;

      &:first-child {
        color: var(--input-color);
      }

      &:last-child {
        color: var(--color-primary);
      }
    }

    &::after {
      content: '';
      position: absolute;
      left: 4px;
      width: calc(50% - 4px);
      height: calc(100% - 8px);
      background: var(--color-primary);
      border-radius: 4px;
      border: 1px solid var(--color-primary);
      transition: transform 0.2s ease;
    }

    &[data-active='pl']::after {
      transform: translateX(100%);
    }

    &[data-active='pl'] {
      div.language-switcher-button:first-child {
        color: var(--color-primary);
      }
      div.language-switcher-button:last-child {
        color: var(--input-color);
      }
    }
  }
}
</style>
