<template name="home">
  <!--div class="pt-4">
    <div class="w-full h-20 bg-gray-300 rounded-lg"></div>

    <div class="w-full p-4 border-gray-300 border-t fixed left-0 bottom-0">
      <router-link to="/card/add">
        <div class="w-full h-12 bg-purple-900 rounded-md flex items-center justify-center">
          <p class="text-white text-sm">Agregar Tarjeta</p>
        </div>
      </router-link>
    </div>
  </div-->
  
  <div class="page home relative">
    <!-- loader -->
    <div class="loader w-full h-screen flex flex-col gap-4 items-center justify-center" v-show="loading">
      <img src="/img/logo-decidir.png" />
      <div class="race-by"></div>
      <p>Cargando</p>
    </div>

    <!-- Payment Info -->
    <div class="payment w-full h-screen flex flex-col gap-8 items-center justify-center" v-show="!loading">
      <img :src="config.logo" alt="logo" class="w-1/2">
      <div class="info flex flex-col gap-2 items-center justify-center">
        <p>Estás a punto de pagar</p>
        <p class="text-2xl font-bold">${{this.total}}</p>
      </div>
      <div class="button rounded-full px-4 py-2 cursor-pointer" :style="{background: config.color}" @click="pay(paymentId)">
        <p class="text-white text-sm">Continuar</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// axios
import axios from 'axios'

// import vue
import { Options, Vue } from "vue-class-component";

@Options({
  name: 'Home',
  data(){
    return{
      config: [],
      loading: true,
      token: String,
      paymentId: Number,
      total: 0
    }
  },
  mounted(){
    // set payment ID
    this.paymentId = this.$route.query.order

    //set token
    this.token = this.$route.query.token

    if(!this.token){
      this.token = 'c2VydmVyOjh2R0h3eGdVYXk4dEJ5cHVRcUExcnFvMDEweDYzUXk3'
    }
    
    if(this.paymentId && this.token){
      //check health and get payment Info
      Promise.resolve(this.getConfig()).then( ()=>{
          Promise.resolve(this.checkHealth( ()=>{
            this.getPaymentInfo(this.paymentId)
          }))
        }
      )
    }else{
      this.$router.push('/warning')
    }
  },
  methods: {
    async getConfig(){
      await axios.get("/config.json")
      .then((response) => {
        localStorage.setItem('config', JSON.stringify(response.data) )
        this.config = response.data
      })
    },
    async checkHealth(callback: ()=> void){
      await axios.get('https://live.decidir.com/api/v2/healthcheck')
      .then(() => {
        callback()
      })
      .catch( error => {
        console.log(error)
      })
    },
    async getPaymentInfo(id: number){
      await axios.get(this.config.paymentGetEndpoint+id+'?access_token='+this.token)
      .then((response) => {
        this.total = response.data.data[this.config.totalField]
        this.loading = false
      })
      .catch( error => {
        console.log(error)
      })
    },
    pay(){
      this.$router.push('/pay?id='+this.paymentId)
    }
  }
}
)
export default class Home extends Vue {}
</script>

<style scoped>
.race-by {
  --uib-size: 80px;
  --uib-speed: 1.4s;
  --uib-color: black;
  --uib-line-weight: 5px;

  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--uib-line-weight);
  width: var(--uib-size);
  border-radius: calc(var(--uib-line-weight) / 2);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}

.race-by::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: var(--uib-color);
  opacity: 0.1;
}

.race-by::after {
  content: '';
  height: 100%;
  width: 100%;
  border-radius: calc(var(--uib-line-weight) / 2);
  animation: raceBy var(--uib-speed) ease-in-out infinite;
  transform: translateX(-100%);
  background-color: var(--uib-color);
}

@keyframes raceBy {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
