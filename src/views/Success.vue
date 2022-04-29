<template>
    <div class="page h-full flex items-center justify-center">
        <div class="msg-container flex flex-col items-center gap-8">
            <img src="/img/circle-check-regular.svg" alt="error" class="w-16">
            <div class="text text-center">
                <p class="text-2xl font-bold">Pagado</p>
                <p>Su pago se procesó correctamente</p>
            </div>
            <div class="button rounded-full px-4 py-2 cursor-pointer" :style="{background: config.color}" @click="backTo()">
                <p class="text-white text-sm">Ver mi pedido</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data(){
        return{
            config: [] as any[any]
        }
    },
    mounted() {
        //set config
        this.config = JSON.parse( localStorage.getItem('config') as any[any])
    },
    methods:{
        backTo(){
            window.location.replace(this.config.backTo)
        }
    }
})
</script>
