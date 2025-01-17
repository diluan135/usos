import searchService from "../services/searchService.js";
import usoService2019 from "../services/usoService2019.js";
import usoService2020 from "../services/usoService2020.js";
import usoService2021 from "../services/usoService2021.js";
import usoService2022 from "../services/usoService2022.js";
import usoService2023 from "../services/usoService2023.js";

export default {
    props: ['dataFunction', 'actions', 'titles', 'tabela', 'tabelaNome'],
    data() {
        return {
            tempo: 0,
            data: [],
            total: 0,
            busca: '',
            validadorBusca: 0,
            searchedWord: '',
            lastSortedKey: -1,
            page: 1,
            qttPerPage: 500,
            i: 0,
            colunaSelecionada: '',
            error: false,
            searchBuscando: 0,
            selectedDate: null,
            dataInicio: '',
            dataFim: '',
            maxLength: 25,
            valorFormatado: '',
            dataSelecionada: '',
            dataSelecionada2: '',
            minDate: "2023-01-01",
            maxDate: "2023-12-31",
            periodo: false,
            colunaOrder: '',
        }
    },
    watch: {
        qttPerPage(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.qttPerPage = newVal;
                this.updateDataAndRoute();
            }
        }
    },
    computed: {
        isUsoPage() {
            // Obtém o caminho da rota atual
            const currentPath = this.$route.path;

            // Verifica se o caminho contém uma das strings desejadas
            return (
                currentPath.includes('/uso2019') ||
                currentPath.includes('/uso2020') ||
                currentPath.includes('/uso2021') ||
                currentPath.includes('/uso2022') ||
                currentPath.includes('/uso2023')
            );
        },
        isUsuarioLinha() {
            const currentPath = this.$route.path;
            return (
                currentPath.includes("usuario_linha")
            )
        },
        dynamicRoute() {
            return this.isUsuarioLinha ? `/${this.$route.params.id}` : "";
        },
    },
    methods: {
        orderBy(coluna) {
            this.colunaOrder = coluna;
            this.page = 1;
            this.updateDataAndRoute();
        },
        selecionarColuna(coluna) {
            this.colunaSelecionada = coluna;
        },

        async search(busca) {
            if (busca.length < 1) {
                this.validadorBusca = 0;
                this.updateDataAndRoute();
            }

            try {

                this.busca = busca;
                // this.data = []
                this.iniciarContagem();
                this.searchBuscando = 1;
                this.validadorBusca = 1;
                this.currentPage = 1; // Atualiza a página atual
                this.page = 1;


                // Atualize a rota para refletir a página atual
                this.$router.push({ query: { page: this.currentPage } });

                // Chame a função dataFunction para buscar os dados da página atual
                const values = await searchService.search(this.busca, this.tabela.bd, this.colunaSelecionada, this.currentPage, this.dataSelecionada, this.dataSelecionada2, this.qttPerPage);
                this.total = values.data.pagination.data.total;

                let valueArray = [];
                values.data.data.forEach(element => {

                    valueArray.push(Object.values(element));
                });
                this.minDate = "2019-01-01";
                this.maxDate = "2023-12-31";
                this.data = valueArray;
                this.searchBuscando = 0;
            } catch (error) {
                console.error('Erro ao buscar os dados', error);
                this.searchBuscando = 0;
            }
        },



        verificaData(cell) {
            if (!cell) return ""; // Lidar com valores nulos ou vazios, se necessário

            const dateTimeFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
            const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
            const timeFormat = /^\d{2}:\d{2}:\d{2}$/;

            if (dateTimeFormat.test(cell) || dateFormat.test(cell)) {
                // Formato Data e Hora ou Apenas Data
                const dateParts = cell.split(" ")[0].split("-");
                return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            } else if (timeFormat.test(cell)) {
                // Formato Hora
                return cell;
            } else {
                // Outro formato, retornar o valor original
                return cell;
            }
        },
        async goToPage(newPage) {
            if (newPage >= 1 && newPage <= Math.ceil(this.total / this.qttPerPage)) {
                this.page = newPage;
                await this.updateDataAndRoute();
            }
        },
        async previousPage() {
            if (this.page > 1) {
                this.page--;
                await this.updateDataAndRoute();
            }
        },
        async nextPage() {
            if (this.page * this.qttPerPage < this.total) {
                this.page++;
                await this.updateDataAndRoute();
            }
        },
        async updateDataAndRoute() {
            this.iniciarContagem();
            this.$router.push({ query: { page: this.page } });

            this.data = [];
            let values = [];
            if (this.validadorBusca == 1) {
                values = await searchService.search(this.busca, this.tabela.bd, this.colunaSelecionada, this.page, this.dataSelecionada, this.dataSelecionada2, this.qttPerPage, this.colunaOrder);
            } else {
                const regex = /(?:usoService\.(getUsoUsuario|getUsuarioLinha|getUsuarioUtilizacao)|categoriaService\.getCategoria|usuarioService\.getUsuario|linhaService\.getLinhas|cartaoService\.getCartoes)/;
                if (regex.test(this.dataFunction)) {
                    values = await this.dataFunction(this.page, this.qttPerPage, this.colunaOrder);
                } else {
                    values = await this.dataFunction(this.page, this.dataInicio, this.dataFim, this.qttPerPage, this.colunaOrder);
                }
            }

            let valueArray = [];
            values.data.data.forEach(element => {
                valueArray.push(Object.values(element));
            });
            this.data = valueArray;

        },
        formatNumberWithDot(number) {
            if (number !== null && number !== undefined) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            } else {
                // Retorne um valor padrão ou vazio, dependendo dos requisitos do seu aplicativo
                return '';
            }
        },
        async handleCalendarClose(selectedDates, dateStr, instance) {

            this.data = []
            this.iniciarContagem();
            this.dataInicio = selectedDates;
            this.dataFim = this.dataSelecionada2;

            this.page = parseInt(this.$route.query.page) || 1;
            await new Promise(resolve => setTimeout(resolve, 3000));
            let values = [];

            const regex = /(?:usoService\.(getUsoUsuario)|categoriaService\.getCategoria|usuarioService\.getUsuario|linhaService\.getLinhas|cartaoService\.getCartoes)/;
            if (regex.test(this.dataFunction)) {
                values = await this.dataFunction(this.page, this.qttPerPage);
            } else {
                values = await this.dataFunction(this.page, this.dataInicio, this.dataFim, this.qttPerPage);
            }

            let valueArray = [];

            try {
                values.data.data.forEach(element => {
                    valueArray.push(Object.values(element));
                });
            } catch (error) {
                this.error = true;
            }


            this.data = valueArray;
            this.colunaSelecionada = this.titles[0];

            this.total = values.pagination.data.total;
        },
        getConfigForBd(tabelaBd) {
            switch (tabelaBd) {
                case 'uso_cartao_0':
                    return { minDate: "01-01-2019", maxDate: "31-12-2019" };
                case 'uso_cartao_1':
                    return { minDate: "01-01-2020", maxDate: "31-12-2020" };
                case 'uso_cartao_2':
                    return { minDate: "01-01-2021", maxDate: "31-12-2021" };
                case 'uso_cartao_3':
                    return { minDate: "01-01-2022", maxDate: "31-12-2022" };
                case 'uso_cartao_4':
                    return { minDate: "01-01-2023", maxDate: "31-12-2023" };
                default:
                    return { minDate: null, maxDate: null };
            }
        },
        isActive(route) {
            return this.$route.path === route;
        },
        irParaPagina(rota) {
            this.$router.push(rota + this.determineDynamicRoute());
        },
        determineDynamicRoute() {
            return this.isUsuarioLinha ? `/${this.$route.params.id}` : "";
        },
        iniciarContagem() {
            this.tempo = 0;

            const intervalId = setInterval(() => {
                this.tempo++;

                if (this.tempo > 10) {
                    clearInterval(intervalId);
                }
            }, 1000);
        },

    },

    async created() {

        this.iniciarContagem();
        this.page = parseInt(this.$route.query.page) || 1;
        let values = [];

        const regex = /(?:usoService\.(getUsoUsuario|getUsuarioUtilizacao)|categoriaService\.getCategoria|usuarioService\.getUsuario|linhaService\.getLinhas|cartaoService\.getCartoes)/;
        if (regex.test(this.dataFunction)) {
            values = await this.dataFunction(this.page, this.qttPerPage);
        } else {
            values = await this.dataFunction(this.page, this.dataInicio, this.dataFim, this.qttPerPage);
        }

        let valueArray = [];

        if (this.tabela.bd == 'uso_cartao_0') {
            this.minDate = "2019-01-01";
            this.maxDate = "2019-12-31";
            this.total = values.pagination.data.total;
        } else if (this.tabela.bd == 'uso_cartao_1') {
            this.minDate = "2020-01-01";
            this.maxDate = "2020-12-31";
            this.total = values.pagination.data.total;
        } else if (this.tabela.bd == 'uso_cartao_2') {
            this.minDate = "2021-01-01";
            this.maxDate = "2021-12-31";
            this.total = values.pagination.data.total;
        } else if (this.tabela.bd == 'uso_cartao_3') {
            this.minDate = "2022-01-01";
            this.maxDate = "2022-12-31";
            this.total = values.pagination.data.total;
        } else if (this.tabela.bd == 'uso_cartao_4') {
            this.minDate = "2023-01-01";
            this.maxDate = "2023-12-31";
            this.total = values.pagination.data.total;
        } else if (this.tabela.bd == 'uso_cartao') {
            this.minDate = "2019-01-01";
            this.maxDate = "2023-12-31";
            this.total = values.pagination.data.total;
        } else if (this.tabela.bd == 'linha') {
            this.total = values.data.pagination.data.total;
        } else {
            this.total = await values.data.total;
        }


        try {
            values.data.data.forEach(element => {
                valueArray.push(Object.values(element));
            });
        } catch (error) {
            this.error = true;
        }

        this.data = valueArray;
        this.colunaSelecionada = this.titles[0];

    },

    template: `
<div style="padding: 4vh 4vh 4vh 4vh;">
    <div style="padding-left:8vh; margin-bottom:20px; margin-top:40px;" class="d-flex align-items-center">
        <div v-if="isUsoPage">
                <div class="container d-flex align-items-center">
                    <div class="text-center">
                    <h2 style="margin-bottom:10px;">Selecione o ano</h2>
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <router-link to="/uso2019" class="btn btn-primary" :class="{ active: isActive('/uso2019') }">2019</router-link>
                            <router-link to="/uso2020" class="btn btn-primary" :class="{ active: isActive('/uso2020') }">2020</router-link>
                            <router-link to="/uso2021" class="btn btn-primary" :class="{ active: isActive('/uso2021') }">2021</router-link>
                            <router-link to="/uso2022" class="btn btn-primary" :class="{ active: isActive('/uso2022') }">2022</router-link>
                            <router-link to="/uso2023" class="btn btn-primary" :class="{ active: isActive('/uso2023') }">2023</router-link>
                        </div>
                    </div>
                </div>
        </div>
        <div v-if="isUsuarioLinha">
            <div class="container d-flex align-items-center">
                <div class="text-center">
                    <h2 style="margin-bottom:10px;">Selecione o ano</h2>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button @click="irParaPagina('/usuario_linha_2019')" class="btn btn-primary" :class="{ active: isActive('/uso2019') }">2019</button>
                        <button @click="irParaPagina('/usuario_linha_2020')" class="btn btn-primary" :class="{ active: isActive('/uso2020') }">2020</button>
                        <button @click="irParaPagina('/usuario_linha_2021')" class="btn btn-primary" :class="{ active: isActive('/uso2021') }">2021</button>
                        <button @click="irParaPagina('/usuario_linha_2022')" class="btn btn-primary" :class="{ active: isActive('/uso2022') }">2022</button>
                        <button @click="irParaPagina('/usuario_linha_2023')" class="btn btn-primary" :class="{ active: isActive('/uso2023') }">2023</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!isUsuarioLinha && !isUsoPage">
            <h2 >Tabela de {{ tabela.name }}</h2>
            <i class="bi bi-house-door"></i>
        </div>
        <div style="margin-right:40px;" class="col d-flex align-items-center justify-content-end">
            <span style="margin-right:10px;">Linhas por página:</span>
            <select v-model="this.qttPerPage" placeholder="Linhas por página">
                <option>10</option>
                <option>50</option>
                <option>100</option>
                <option>500</option>
                <option>1000</option>
            </select>
        </div>
    </div>
    
    
        <div class="d-flex justify-content-center align-items-center" style="height:100vh;" v-if="this.data.length === 0">
            <div v-if="tempo > 10 || this.error == true">
                <h3>Sem registro encontrado :(</h3>
                <button @click="previousPage()" >Voltar</button>
            </div>
            <div v-else>
                <img src="../img/loading.gif">
            </div>
        </div>


        <div v-else id="card" style="margin-top:20px;">
            <div style="margin: 0px 0px 30px 0px;" class="row align-items-center">                
                <div class="col-6">
                    <div class="row align-items-center">
                        <div class="btn-group">
                            <div class="col-8">
                                <input type="text" id="searchConecta" v-model="busca" placeholder="Pesquise aqui...">
                            </div>

                            
                            <button class="btn btn-outline-primary dropdown dropdown-toggle" id="dropdown2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {{ colunaSelecionada.name }}
                            </button>
                            <ul class="dropdown-menu">
                                <template v-for="(title, index) in titles">
                                    <li v-if="title.name != 'Dia do uso'">
                                        <a @click="selecionarColuna(title)" class="dropdown-item">
                                        {{ title.name }}
                                        </a>
                                    </li>
                                </template>
                            </ul>
                            <button v-if="this.searchBuscando === 0" id="dropdown3" class="btn btn-outline-primary col-2" @click="search(busca)">Pesquisar</button>
                            <button v-else="this.searchBuscando === 1" id="dropdown3" style="text-align: center;" class="btn btn-outline-primary col-2"><i class="fa-solid fa-spinner fa-spin-pulse"></i></button>
                        </div>
                    </div>
                </div>
                <div v-show="this.tabela.bd === 'uso_cartao_0' || this.tabela.bd === 'uso_cartao_1' || this.tabela.bd === 'uso_cartao_2' || this.tabela.bd === 'uso_cartao_3' || this.tabela.bd === 'uso_cartao_4' " class="col">
                    <div class="d-flex align-items-center justify-content-end">
                        <template v-if="this.periodo == true">
                            <div class="input-group">
                                <input type="date" :min="this.minDate" :max="this.maxDate" class="form-control" placeholder="Selecione uma data" v-model="this.dataSelecionada" @change="this.handleCalendarClose(this.dataSelecionada)">
                                <span class="d-flex align-items-center" style="margin-left:10px;margin-right:10px;"> até </span>
                                <input type="date" :min="this.minDate" @change="this.handleCalendarClose(this.dataSelecionada)" :max="this.maxDate" class="form-control" placeholder="Selecione uma data" v-model="this.dataSelecionada2">
                                <button class="btn btn-outline-primary" id="dropdown2" style="width: auto; padding-left: 10px;"><i class="fa-solid fa-magnifying-glass"></i @click="this.dataSelecionada"></button>
                            </div>
                        </template>
                        <template v-if="this.periodo == false">
                            <div class="d-flex input-group justify-content-end">
                                <input style="width:50%; flex:none;" type="date" :min="this.minDate" :max="this.maxDate" class="form-control" placeholder="Selecione uma data" v-model="this.dataSelecionada" @change="this.handleCalendarClose(this.dataSelecionada)">
                                <button class="btn btn-outline-primary" id="dropdown2" style="width: auto; padding-left: 10px; background-color: #fff;"><i class="fa-solid fa-magnifying-glass"></i @click="this.dataSelecionada"></button>
                                <button class="btn btn-outline-primary" id="dropdown3" style="width: auto;" @click="this.periodo = true"> + </button>
                            </div>
                        </template>
                    </div>
                </div>

                
            </div>
            <table id="tabela" class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <template v-for="(title, index) in titles">
                            <th id="cabecalho" @click="orderBy(title.bd)" class="table-primary">
                                {{ title.name }} <i style="margin-left:6px;" class="fa-solid fa-sort fa-xs"></i>
                            </th>
                        </template>
                        <th v-if="actions.length > 0" id="cabecalho2" class="table-primary">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody id="items">
                    <template v-for="(row, index) in data" :key="index">
                        <tr v-if="(new RegExp(searchedWord, 'i')).test(row.toString()) && searchedWord !== '' || (new RegExp(searchedWord, 'i')).test(row.toString())">
                            <template v-for="cell in row">
                                <td>
                                    {{ this.verificaData(cell) }}
                                </td>
                            </template>
                            <td v-if="actions.length > 0">
                                <template v-for="action in actions">
                                    <router-link style="margin-right:5px;" :to="action.link + '/' + row[0]">{{ action.name }}</router-link>
                                </template>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                    <span id="mostrando">
                    Mostrando {{
                      this.total !== 0
                        ? formatNumberWithDot((page - 1) * qttPerPage + 1)
                        : 0
                    }} - {{
                      page * qttPerPage >= this.total
                        ? formatNumberWithDot(this.total)
                        : formatNumberWithDot(page * qttPerPage)
                    }} de {{ formatNumberWithDot(this.total) }}
                  </span>
                    </div>
                    <div class="col-md-6">
                        <ul class="pagination justify-content-end custom-pagination">
                            
                            <li @click="goToPage(39)" class="page-item custom-pagination-item">
                                <span class="page-link">{{ 39 }}</span>
                            </li>
                            <li @click="previousPage" v-show="page > 1" class="page-item custom-pagination-item">
                                <span class="page-link">Anterior</span>
                            </li>
                            <li @click="goToPage(1)" v-show="page > 1" class="page-item custom-pagination-item">
                                <span class="page-link">1</span>
                            </li>
                            <li @click="goToPage(page - 1)" v-show="page > 2" class="page-item custom-pagination-item">
                                <span class="page-link">{{ page - 1 }}</span>
                            </li>
                            <li class="page-item custom-pagination-item active">
                                <span class="page-link">{{ page }}</span>
                            </li>
                            <li @click="goToPage(page + 1)" v-show="page < Math.ceil(this.total / qttPerPage) - 1" class="page-item custom-pagination-item">
                                <span class="page-link">{{ page + 1 }}</span>
                            </li>
                            <li @click="goToPage(Math.ceil(this.total / qttPerPage))" v-show="page * qttPerPage < this.total - 1" class="page-item custom-pagination-item">
                                <span class="page-link">{{ Math.ceil(this.total / qttPerPage) }}</span>
                            </li>
                            <li @click="nextPage" v-show="page * qttPerPage < this.total - 1" class="page-item custom-pagination-item">
                                <span class="page-link">Próximo</span>
                            </li>
                        </ul>
                    </div>



                
                </div>
            </div>

        </div>
    </div>
    `
}