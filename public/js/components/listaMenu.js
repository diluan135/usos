export default{
    
    watch: {
        '$route.path'(newPath) {
            // Mapeie os caminhos dos links para os índices correspondentes
            const pathToIndex = {
                '/cartao': 1,
                '/categoria': 2,
                '/linha': 3,
                '/uso2023': 4,
                '/usuario': 5,
            };
    
            // Verifique se o novo caminho existe no mapeamento
            if (newPath in pathToIndex) {
                const selectedIndex = pathToIndex[newPath];
                
                // Atualize o estado de seleção com base no novo caminho
                this.items_selecionados = this.items_selecionados.map((_, index) => index === selectedIndex);
            }
        }
    },
    
    data(){
        return{
            items_selecionados:[
                false,false,false,false,false, false    //são 6 'false' pq começa do 0 e fiquei com preguiça de reorganizar o código
            ],
        }
    },
    mounted(){
        this.selecionar(1);
    },
    methods:{
        selecionar(entrada){
            this.items_selecionados.forEach((element, index) => {
                if(index == entrada){
                    this.items_selecionados[index] = true
                }else{
                    this.items_selecionados[index] = false
                }
                
            });
        }
    },
    template:`
    <div>
        <div style="margin: 30px 30px 10px 30px;" class="row align-items-center">
            <div class="col-2">
                <a href="https://www.amttdetra.com/">
                    <img src="/img/conectaLogo.png" width=200>
                </a>
            </div>

            <div class="col d-flex flex-column align-items-end">
                <div class="row align-items-center">
                    <div class="col d-flex flex-column align-items-center" style="min-width: 300px;">
                        <router-link class="menu-item" to="/cartao" @click="selecionar(1)" :class="[{selecionado: items_selecionados[1]}]">
                            <img src="/img/cartao.png" width=48 height=48 />
                            <label style="margin-left:10px;" class="d-xs-none d-sm-inline d-md-inline d-lg-inline">Cartões</label>
                        </router-link>
                    </div>
                    <div class="col d-flex flex-column align-items-center" style="min-width: 300px;">
                        <router-link class="menu-item" to="/categoria" @click="selecionar(2)" :class="[{selecionado: items_selecionados[2]}]">
                            <img src="/img/categoria.png" width=48 height=48 />
                            <label style="margin-left:10px;" class="d-xs-none d-sm-inline d-md-inline d-lg-inline">Categorias de cartão</label>
                        </router-link>
                    </div>
                    <div class="col d-flex flex-column align-items-center" style="min-width: 300px;">
                        <router-link class="menu-item" to="/linha" @click="selecionar(3)" :class="[{selecionado: items_selecionados[3]}]">
                            <img src="/img/linha.png" width=48 height=48 />
                            <label style="margin-left:10px;" class="d-xs-none d-sm-inline d-md-inline d-lg-inline">Linhas</label>
                        </router-link>
                    </div>
                    <div class="col d-flex flex-column align-items-center" style="min-width: 300px;">
                        <router-link class="menu-item" to="/uso2023" @click="selecionar(4)" :class="[{selecionado: items_selecionados[4]}]">
                            <img src="/img/uso.png" width=48 height=48 />
                            <label style="margin-left:10px;" class="d-xs-none d-sm-inline d-md-inline d-lg-inline">Usos do cartão</label>
                        </router-link>
                    </div>
                    <div class="col d-flex flex-column align-items-center" style="min-width: 300px;">
                        <router-link class="menu-item" to="/usuario" @click="selecionar(5)" :class="[{selecionado: items_selecionados[5]}]">
                            <img src="/img/usuario.png" width=48 height=48 />
                            <label style="margin-left:10px;" class="d-xs-none d-sm-inline d-md-inline d-lg-inline">Usuários</label>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>

    `
}