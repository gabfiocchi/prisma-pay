<template>
    <main class="px-4 h-full w-full md:w-1/2 md:mx-auto">
       <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  components: {
  },
});
</script>

<style>
.fade-enter-active, .fade-leave-active /* .fade-leave-active below version 2.1.8 */ {
  position: absolute;
  width: 100%;
  left: 0;
}

/*-- Transition --*/
.fade-enter-active{
  animation: enter .5s linear;
}

.fade-leave-active{
  opacity: 0;
}

@keyframes enter {
  0% {
    opacity: 0;
    top: 64px;
  }
  50% {
    opacity: 0;
    top: 64px;
  }
  100% {
    opacity: 100;
    top: 0px;
  }
}

@keyframes leave {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
    }
}
</style>

