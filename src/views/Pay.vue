<template name="add-card">
  <div class="pay relative h-full flex items-center justify-center">
    <div class="card-form flex flex-col gap-4" v-if="!isProcessing">
      <!-- card preview -->
      <div class="card-preview w-1/2 mx-auto">
        <FlipCard :front='config.cardFront' :back='config.cardBack' :flipped="flipCard"/>
      </div>

      <!-- card form -->
      <form ref="form" class="flex overflow-hidden">
        <!-- card number -->
        <div class="form-row flex-none w-full flex flex-col px-4">
          <div
            class="
              form-field
              flex flex-col
              w-full
              border border-gray-300
              rounded-md
            "
          >
            <input
              type="text"
              name="cardNumber"
              inputmode="numeric"
              minlength="16"
              pattern="[0-9\s]{13,19}"
              class="py-3 w-full outline-none text-center text-xl font-bold"
              placeholder="**** **** **** ****"
              data-decidir="card_number"
              v-on:keyup.enter="changeField('next')"
            />
          </div>
          <!-- hint text -->
          <p class="text-center text-sm mt-2">Ingrese el número de tarjeta</p>
        </div>
        <!-- card holder -->
        <div class="form-row flex-none w-full flex flex-col">
          <div
            class="
              form-field
              flex flex-col
              w-full
              border border-gray-300
              rounded-md
            "
          >
            <input
              type="text"
              name="cardHolder"
              inputmode="text"
              minlength="1"
              class="py-3 w-full outline-none text-center text-xl font-bold"
              placeholder="Nombre y Apellido"
              data-decidir="card_holder_name"
              v-on:keyup.enter="changeField('next')"
            />
          </div>
          <!-- hint text -->
          <p class="text-center text-sm mt-2">Ingrese el nombre del titular</p>
        </div>
        <!-- expiration -->
        <div class="flex-none w-full flex flex-col">
          <div
            class="
              form-field
              flex flex-col
              w-full
              border border-gray-300
              rounded-md
            "
          >
            <input
              type="text"
              name="cardExp"
              inputmode="numberic"
              pattern="\d*"
              maxlength="5"
              minlength="5"
              class="py-3 w-full outline-none text-center text-xl font-bold"
              placeholder="MM/AA"
              v-on:keyup.enter="changeField('next')"
            />
          </div>
          <!-- hint text -->
          <p class="text-center text-sm mt-2 w-full flex-none">Fecha de Vto.</p>
        </div>
        <!-- cvv -->
        <div class="form-row flex-none w-full flex flex-col">
          <div
            class="
              form-field
              flex flex-col
              w-full
              border border-gray-300
              rounded-md
            "
          >
            <input
              type="text"
              name="cardCvv"
              inputmode="numberic"
              pattern="\d*"
              minlength="3"
              maxlength="3"
              class="py-3 w-full outline-none text-center text-xl font-bold"
              placeholder="123"
              data-decidir="security_code"
              v-on:keyup.enter="changeField('next')"
            />
          </div>
          <p class="text-center text-sm mt-2 w-full flex-none">
            Cod. de Seguridad
          </p>
        </div>
        <!-- id number -->
        <div class="flex-none w-full flex flex-col">
          <div
            class="
              form-field
              flex flex-col
              w-full
              border border-gray-300
              rounded-md
            "
          >
            <input
              type="text"
              name="idNumber"
              pattern="\d*"
              minlength="8"
              maxlength="8"
              inputmode="numberic"
              class="py-3 w-full outline-none text-center text-xl font-bold"
              placeholder="99999999"
              data-decidir="card_holder_doc_number"
              v-on:keyup.enter="getToken()"
            />
          </div>
          <p class="text-center text-sm mt-2 w-full flex-none">Nro de DNI</p>
        </div>
      </form>

      <!-- buttons -->
      <div class="buttons flex-none w-5/6 flex gap-4 justify-between mx-auto">
        <div
          class="button flex items-center gap-2 cursor-pointer"
          :class="currentIndex - 1 >= 0 ? 'opacity-75' : 'opacity-25'"
          ref="prevField"
          @click="changeField('prev')"
        >
          <img src="/img/chevron-l.svg" class="w-3" />
          <p class="text-sm">Anterior</p>
        </div>
        <div
          class="button flex gap-2 items-center opacity-75 cursor-pointer"
          ref="nextField"
          v-if="currentIndex + 1 < inputsCount"
          @click="changeField('next')"
        >
          <p class="text-sm" v-if="currentIndex + 1 < inputsCount">Siguiente</p>
          <img src="/img/chevron-r.svg" class="w-3" />
        </div>
        <div
          class="button flex gap-2 items-center cursor-pointer"
          ref="nextField"
          v-else
          @click="getToken()"
        >
          <p class="text-sm font-semibold">Finalizar</p>
          <img src="/img/chevron-r.svg" class="w-3" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div class="loading-container" v-show="isProcessing">
      <!--div class="clock" v-if="!config.loading || config.loading == ''">
        <div class="hand hour"></div>
        <div class="hand minute"></div>
      </div-->
      <div class="loading flex flex-col w-1/2 items-center md:w-1/6">
        <img :src="config.loading" alt="loading" class="w-full">
        <p>Procesando</p>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
// axios
import axios from 'axios'

//smooth scroll polyfill
import smoothscroll from "smoothscroll-polyfill";

//custom components
import FlipCard from "@/components/FlipCard.vue";

import { Options, Vue } from "vue-class-component";

@Options({
  components: {
    FlipCard
  },
  data() {
    return {
      config: [],
      flipCard: false,
      inputsCount: 0,
      currentIndex: 0,
      isProcessing: false,
    }
  },
  mounted() {
    //set config
    this.config = JSON.parse( localStorage.getItem('config') as any[any])

    // set server url
    this.serverUrl = this.config.paymentPostEndpoint

    //set smooth scroll
    smoothscroll.polyfill();

    // select all inputs
    var inputs = document.querySelectorAll("input");

    if(inputs.length > 0){
      // set inputs total count
      this.inputsCount = inputs.length

      // focus first input
      inputs[0].focus();

      // add events for each input
      inputs.forEach((input) => {
        input.addEventListener("keydown", (event) => {
          let name = input.getAttribute("name") as string;
          let oldValue = input.value;
          let newValue = '';

          // get new value
          if (event.key !== "Backspace" && event.key.length === 1) {
            if (name == "cardNumber") {
              newValue = this.cc_format(oldValue)
            } else if (name == "cardExp") {
              newValue = this.exp_format(oldValue)
            } else if (oldValue.length === 0) {
              newValue = event.key
            }
          }

          // disable backspace
          if (event.key === "Backspace") {
              newValue = oldValue
          }

          //update current input
          if (newValue.length > 1) {
            input.value = newValue
          }
        });

        input.addEventListener("focus", () => {
          input.classList.add("active")
        });
      });
    }
  },
  methods: {
    cc_format: function (value: string) {
      var v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
      var matches = v.match(/\d{4,16}/g)
      var match = (matches && matches[0]) || ""
      var parts = []

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4))
      }

      if (parts.length) {
        return parts.join(" ")
      } else {
        return value
      }
    },
    exp_format: function (value: string) {

      var v = value.replace(/\s+/g, "").replace(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})/gi, "")
      var matches = v.match(/\d{2,4}/g);
      var match = (matches && matches[0]) || ""
      var parts = [];

      for (let i = 0, len = match.length; i < len; i += 2) {
        parts.push(match.substring(i, i +2))
      }

      if (parts.length) {
        return parts.join("/")
      } else {
        return value;
      }
    },
    changeField: function (direction: string) {
      // select all inputs
      var inputs = document.querySelectorAll("input")

      //get current input
      const input = inputs[this.currentIndex]

      // get form and form width
      const form = this.$refs.form;
      const formW = form.offsetWidth;

      // old position
      let oldPos = form.scrollLeft;

      // new position
      let newPos = oldPos;

      // can procees flag
      let canProceed = true;

      //get input min lenght
      const minLenght = Number(input.getAttribute("minlength"));

      // check if current input is empty
      if (
        (input.value.length === 0 || input.value.length < minLenght) &&
        direction == "next"
      ) {
        canProceed = false;
        input.classList.add("border", "border-red-600");
      }

      if (
        direction == "next" &&
        canProceed &&
        this.currentIndex >= 0 &&
        this.currentIndex < inputs.length - 1
      ) {
        this.currentIndex++;
        newPos = oldPos + formW;
        
        // flip card on cvv
        if(inputs[this.currentIndex].name == "cardCvv"){
          this.flipCard = true
        }else{
          this.flipCard = false
        }
      }

      if (
        direction == "prev" &&
        canProceed &&
        this.currentIndex >= 0 &&
        this.currentIndex < inputs.length
      ) {
        this.currentIndex--;
        inputs[this.currentIndex].focus()
        newPos = oldPos - formW;
        input.classList.remove("active")
      }

      if (canProceed) {
        form.scroll({
          top: 0,
          left: newPos,
          behavior: "smooth",
        });

        inputs[this.currentIndex].focus();
      }
    },
    getToken: async function(){
      
      //set is proccessing flag
      this.isProcessing = true
    
      // decidir
      const publicApiKey = this.config.prodPublicKey
      const url = 'https://live.decidir.com/api/v2'
      const decidir = new (window as any).Decidir(url, true)
      decidir.setPublishableKey(publicApiKey)
      decidir.setTimeout(5000)

      // get form
      const form = this.$refs.form

      // get card number
      const cardNumber = form.querySelector('[name=cardNumber]').value

      // get exp date and split
      const cardExp = form.querySelector('[name=cardExp]').value.split('/')
      form.querySelector('[name=cardExp]')

      // add exp month
      let month = document.createElement("input");
      month.type = "number"
      month.name = "expMonth"
      month.value = cardExp[0]
      month.setAttribute('data-decidir', 'card_expiration_month')
      form.appendChild(month);

      // add exp year
      let year = document.createElement("input");
      year.type = "number"
      year.name = "expYear"
      year.value = cardExp[1]
      year.setAttribute('data-decidir', 'card_expiration_year')
      form.appendChild(year);

      // add card holder identification
      let cardHolderType = document.createElement("input");
      cardHolderType.type = "text"
      cardHolderType.name = "cardHolderType"
      cardHolderType.value = 'DNI'
      cardHolderType.setAttribute('data-decidir', 'card_holder_doc_type')
      form.appendChild(cardHolderType);

      // response handler
      const sdkResponseHandler = (status: any, response: any) => {
        if (status !== 200 && status !== 201) {
          this.$router.push('/error')
        } else {
          // add issuer
          response.issuer = decidir.cardType(cardNumber)

          // process payment
          this.processPayment(response)
        }
      }

      //send
      decidir.createToken(form, sdkResponseHandler)
    },
    processPayment: async function (tokenData: any) {

      // set payload
      const payload = {
        orderId: this.$route.query.id,
        id: tokenData.id,
        pm: tokenData.issuer,
        bin: tokenData.bin
      }

      // send to backend
      await axios({
        method: 'post',
        url: this.serverUrl,
        headers: {}, 
        data: payload
      })
      .then((response: any)=>{
        console.log(response)
        if(response.data.status === 'approved'){
          this.$router.push('/success')
        }else{
          this.$router.push('/error')
        }
      })
      .catch((error)=>{
        console.log(error)
        this.$router.push('/error')
      })
    },
  },
})
export default class AddCard extends Vue {}
</script>

<style scoped>
.clock {
  height: 2em;
  width: 2em;
  font-size: 20vmin;
  color: #FFF;
  border: .15em solid #784178;
  border-radius: 2em;
}

.hand {
  display: block;
  width: .13em;
  height: 0.8em;
  border-radius: .2em;
  background: #784178;
  position: absolute;
  bottom: 50%;
  left: 50%;
  margin: 0 -0.06em -0.06em;
  transform-origin: center calc(100% - .06em);
  animation-duration: 2s;
  animation-timing-function: lineal;
  animation-iteration-count: infinite;
}


.hour {
  opacity: 1;
  height: .7em;
  animation-name: hour-move;
}

.minute {
  animation-name: minute-move;
}

@keyframes minute-move {
  0% { transform: rotate(.45turn); }
  100% {
    transform: rotate(2.45turn);
  }
}

@keyframes hour-move {
  0% { transform: rotate(.55turn); }
  100% { transform: rotate(1.55turn); }
}

.loading-container, .loading-container:before, .clock-container:after {
  box-sizing: border-box;
  position: relative;
}

.loading-container {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
}
</style>

