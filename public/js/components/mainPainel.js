export default{
    
    data(){
        return{
            tipo: "",
            dados:[],
            escolar: true,
            loading: false,
        }
    },
    mounted(){
    this.getNotificacoes();

    }

    ,
    methods:{
        async getNotificacoes(){
            // b1dc3c4c-0c04-4b51-b4f9-13ee8bdffc27
            await axios.get("https://onesignal.com/api/v1/notifications?app_id=0748ca4f-6e75-4371-8820-7b2114c7332b",{
                headers:{
                    Authorization: "Bearer OTgxYzI5NjgtOGFiMy00YzI1LThhMDAtMjc4OTMzODBkZWE2"
                }
            }).then((response)=>{
                this.dados = response.data.notifications;
                this.loading = true;
            })
        },
        formatDate(timestamp) {
            const date = new Date(timestamp * 1000);
            const options = { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };
            return date.toLocaleDateString('pt-BR', options).replace(',', '');
          },
          alternarEscolar(action) {
            this.escolar = !this.escolar;

            if (action === 'vermenos') {
                const titleElement = document.getElementById('conectaBusTitle');
                if (titleElement) {
                    const offset = -40; // Adjust this value as needed
                    const scrollPosition = titleElement.getBoundingClientRect().top + window.scrollY + offset;
                    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                }
            }
          },
          formataIcone(icone) {
            if(icone == 'icon_0'){
                return 'Alteração de rota'
            }else if(icone == 'icon_1'){
                return 'Alteração de horário'
            }else if(icone == 'icon_2'){
                return 'Comunicado geral'
            }

          }
    },
    template:`
    <div class="container">
        <div style="margin: 40px 0px 20px 0px;" class="row justify-content-md-center">
            <img style="height:80px; width:auto;" src="painel_notificacoes/lib/imgs/not_env2.png">
        </div>

        <!-- Conecta Bus -->
        <div id="card" class="container-flex text-center">
            <div class="row text-start" style="border-top-left-radius: 50px; margin-left: -35px; margin-top:-30px; background-color: #c0fb00;">
                <div class="col-5">
                    <h2 id="conectaBusTitle" style="margin: 20px 0px 15px 50px;">Conecta Bus</h2>
                </div>
            </div>
            

            <transition>
            <div class="container-flex text-center " v-if="loading == false">
                <img src="painel_notificacoes/lib/imgs/loading.gif" class="loading">
            </div>

            <div v-else>
                <div v-if="escolar" class="row text-start">
                    <div id="cardInterno" class="row row-cols-2">
                        <div class="col" style="margin-bottom:5vh;">
                            <h5><b style="color=#fff;">Título: </b>{{ dados[0].headings.en }} </h5>
                            <p><b>Descrição: </b>{{ dados[0].contents.en }}</p>
                            <p><b>Tipo: </b>{{ formataIcone(dados[0].small_icon) }}</p>
                            <p><b>Data: </b> {{ formatDate(dados[0].completed_at) }}</p>
                        </div>
                        <div class="col" style="margin-bottom:5vh;">
                            <h5><b style="color=#fff;">Título: </b>{{ dados[1].headings.en }} </h5>
                            <p><b>Descrição: </b>{{ dados[1].contents.en }}</p>
                            <p><b>Tipo: </b>{{ formataIcone(dados[1].small_icon) }}</p>
                            <p><b>Data: </b> {{ formatDate(dados[1].completed_at) }}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="row text-start">
                    <div id="cardInterno" class="row row-cols-2">
                        <template v-for="dado in dados">
                            <div class="col" style="margin-bottom:5vh;">
                                <h5><b style="color=#fff;">Título: </b>{{ dado.headings.en }} </h5>
                                <p><b>Descrição: </b>{{ dado.contents.en }}</p>
                                <p><b>Tipo: </b>{{ formataIcone(dado.small_icon) }}</p>
                                <p><b>Data: </b> {{ formatDate(dado.completed_at) }}</p>
                            </div>
                        </template>
                    </div>
                </div>

                <div style="margin-left:15px;" class="row text-start">
                    <div v-if="escolar">
                        <p id="verMais" @click="alternarEscolar('vermais')"><u>VER MAIS</u></p>
                    </div>
                    <div v-else>
                        <p id="verMais" @click="alternarEscolar('vermenos')"><u>VER MENOS</u></p>
                    </div>
                </div>
            </div>
            
            

            </transition>

            
            
            
        </div>


        <!-- Conecta Escolar -->
        <div id="card" class="container-flex text-center">
            <div class="row text-start" style="border-top-left-radius: 50px; margin-left: -35px; margin-top:-30px; background-color: #c0fb00;">
                <div class="col-5">
                    <h2 style="margin: 20px 0px 15px 50px;">Conecta Escolar</h2>
                </div>
            </div>

            <div class="row text-start">
                <div id="cardInterno" class="col-6">
                    <h5><b style="color=#fff;">ID: </b>123456</h5>
                    <p><b>Título: </b>Lorem Ipsum</p>
                    <p><b>Descrição: </b>Lorem ipsum sit at door in lorem self under the dog</p>
                    <p><b>Imagem: </b>“https://lorem.ipsum.com”</p>
                    <p><b>Data: </b>12/12/2022</p>
                </div>
                <div class="col">
                    <div id="cardInterno">
                        <h5><b>ID: </b>123456</h5>
                        <p><b>Título: </b>Lorem Ipsum</p>
                        <p><b>Descrição: </b>Lorem ipsum sit at door in lorem self under the dog</p>
                        <p><b>Imagem: </b>“https://lorem.ipsum.com”</p>
                        <p><b>Data: </b>12/12/2022</p>
                    </div>
                </div>
            </div>

            <div style="margin-top:10px; margin-left:15px;" class="row text-start">
                <div>
                    <p><u>VER MAIS</u></p>
                </div>
            </div>
        </div>


        <!-- Conecta Rural -->
        <div id="card" class="container-flex text-center">
            <div class="row text-start" style="border-top-left-radius: 50px; margin-left: -35px; margin-top:-30px; background-color: #c0fb00;">
                <div class="col-5">
                    <h2 style="margin: 20px 0px 15px 50px;">Conecta Rural</h2>
                </div>
            </div>

            <div class="row text-start">
                <div id="cardInterno" class="col-6">
                    <h5><b style="color=#fff;">ID: </b>123456</h5>
                    <p><b>Título: </b>Lorem Ipsum</p>
                    <p><b>Descrição: </b>Lorem ipsum sit at door in lorem self under the dog</p>
                    <p><b>Imagem: </b>“https://lorem.ipsum.com”</p>
                    <p><b>Data: </b>12/12/2022</p>
                </div>
                <div class="col">
                    <div id="cardInterno">
                        <h5><b>ID: </b>123456</h5>
                        <p><b>Título: </b>Lorem Ipsum</p>
                        <p><b>Descrição: </b>Lorem ipsum sit at door in lorem self under the dog</p>
                        <p><b>Imagem: </b>“https://lorem.ipsum.com”</p>
                        <p><b>Data: </b>12/12/2022</p>
                    </div>
                </div>
            </div>

            <div style="margin-top:10px; margin-left:15px;" class="row text-start">
                <div>
                    <p><u>VER MAIS</u></p>
                </div>
            </div>
        </div>


        <!-- Conecta Taxi -->
        <div id="card" class="container-flex text-center">
            <div class="row text-start" style="border-top-left-radius: 50px; margin-left: -35px; margin-top:-30px; background-color: #c0fb00;">
                <div class="col-5">
                    <h2 style="margin: 20px 0px 15px 50px;">Conecta Taxi</h2>
                </div>
            </div>

            <div class="row text-start">
                <div id="cardInterno" class="col-6">
                    <h5><b style="color=#fff;">ID: </b>123456</h5>
                    <p><b>Título: </b>Lorem Ipsum</p>
                    <p><b>Descrição: </b>Lorem ipsum sit at door in lorem self under the dog</p>
                    <p><b>Imagem: </b>“https://lorem.ipsum.com”</p>
                    <p><b>Data: </b>12/12/2022</p>
                </div>
                <div class="col">
                    <div id="cardInterno">
                        <h5><b>ID: </b>123456</h5>
                        <p><b>Título: </b>Lorem Ipsum</p>
                        <p><b>Descrição: </b>Lorem ipsum sit at door in lorem self under the dog</p>
                        <p><b>Imagem: </b>“https://lorem.ipsum.com”</p>
                        <p><b>Data: </b>12/12/2022</p>
                    </div>
                </div>
            </div>

            <div style="margin-top:10px; margin-left:15px;" class="row text-start">
                <div>
                    <p><u>VER MAIS</u></p>
                </div>
            </div>
        </div>

    </div>
    `
}