import usoService from "../services/usoService.js";
import cartaoService from "../services/cartaoService.js";

export default {
  props: ['id', 'dataFunction'],

  components: {
    usoService,
    cartaoService,
  },

  data() {
    return {
      data: [],
      tempo: 0,
    };
  },

  beforeRouteEnter(to, from, next) {
    const coluna = to.params.id;

    const redirectToDetalhes = (usuario_id) => {
      if (usuario_id) {
        window.location.href = `/detalhes/${usuario_id}`;
      } else {
        console.error('Erro: Não foi possível encontrar o ID do usuário na resposta');
      }
    };

    if (from.path === '/uso') {
      usoService.encontrarUsuarioPorCartaoId(coluna)
        .then(response => {
          const cartaoID = response.data.cartao_id;
          return cartaoService.getUsuario(cartaoID);
        })
        .then(usuario => {
          redirectToDetalhes(usuario.data.usuario_id);
        })
        .catch(error => {
          if (error.response) {
            console.error('Erro na Etapa 2:', error.response.data);
          } else if (error.message) {
            console.error('Erro na Etapa 2:', error.message);
          } else {
            console.error('Erro na Etapa 2:', error);
          }
        });
    } else if (from.path === '/cartao') {
      // console.log('veio de cartao');
      cartaoService.getUsuario(coluna)
        .then(usuario => {
          redirectToDetalhes(usuario.data.usuario_id);
        })
        .catch(error => {
          if (error.response) {
            console.error('Erro na Etapa 2:', error.response.data);
          } else if (error.message) {
            console.error('Erro na Etapa 2:', error.message);
          } else {
            console.error('Erro na Etapa 2:', error);
          }
        });
    } else {
      // console.log('nao veio de uso');
      next();
    }
  },


  methods: {
    converterData(dataNoFormatoISO) {
      if (!dataNoFormatoISO) {
        return 'N/D'; // Retorna "N/D" se a data estiver em branco ou nula
      }
    
      // Verifica se a data está em um formato reconhecido
      const data = new Date(dataNoFormatoISO);
      if (isNaN(data)) {
        return 'Data inválida'; // Retorna "Data inválida" se a data não for válida
      }
    
      const dia = data.getDate().toString().padStart(2, '0');
      const mes = (data.getMonth() + 1).toString().padStart(2, '0');
      const ano = data.getFullYear();
    
      return `${dia}/${mes}/${ano}`;
    },
    converterSexo(sexo){
      if(sexo === 'F'){
        return 'Feminino'
      }else if(sexo === 'M'){
        return 'Masculino'
      }else{
        return sexo
      }
    },
    startTimer() {
      setInterval(() => {
        this.tempo++; // Incrementar o contador de tempo a cada segundo
      }, 1000); // Intervalo de 1 segundo (1000 milissegundos)
    },
    async loadData() {
      try {
        let values = await this.dataFunction();
        this.data = values.data;
      } catch (error) {
        console.error('Erro ao carregar dados', error);
      }
    },
  },
  mounted() {
    this.startTimer(); // Iniciar o contador de tempo
    this.loadData(); // Carregar dados iniciais

  },

  template: `
<div class="d-flex justify-content-center align-items-center">

    <div style="height:100vh;" v-if="this.data.length === 0">
        <div v-if="data.length === 0 && tempo > 1">
            <h3>Sem registro encontrado :(</h3>
        </div>
        <div v-else>
            <img src="../img/loading.gif">
        </div>
    </div>

    <div class="form-control" style="padding-left:50px; padding-top:50px" id="card2" v-else>
    <h3 style="margin-bottom:15px; padding-left:20px;">Dados Pessoais</h3>
      <div class="row">
        <div class="col-10">
          <div class="input-group mb-3 d-flex justify-content-center">
              <span class="input-group-text">Nome completo</span>
              <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.nome ? '' : '<strong>N/D:</strong> ') + (data.nome ? data.nome : '<strong>N/D</strong>')"></span>
          </div>
          
          <div class="row">
            <div class="col input-group mb-3 d-flex justify-content-center">
                <span class="input-group-text">Data de nascimento</span>
                <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.nascimento ? '' : '<strong>N/D:</strong> ') + (data.nascimento ? converterData(data.nascimento) : '<strong>N/D</strong>')"></span>
            </div>
            <div class="col input-group mb-3 d-flex justify-content-center">
              <span class="input-group-text">Sexo</span>
              <span class="input-group-text col text-center" id="respostaDetalhes"
              v-html="(data.sexo ? converterSexo(data.sexo) || '<strong>N/D</strong>' : '<strong>N/D</strong>')"></span>
            </div>
          </div>

          <div class="input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Email</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.email ? data.email : '<strong>N/D</strong>')"></span>
          </div>

          
          <div class="row">
            <div class="col input-group mb-3 d-flex justify-content-center">
              <span class="input-group-text">Telefone</span>
              <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.telefone ? data.telefone : '<strong>N/D</strong>')"></span>
            </div>
            <div class="col input-group mb-3 d-flex justify-content-center">
                <span class="input-group-text">Celular</span>
                <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.celular ? data.celular : '<strong>N/D</strong>')"></span>
            </div>
          </div>

        </div>

        <div class="col">
          <img style="width: 200px; height:200px; float: right;" src="../img/logomarcapositiva.png">
        </div>
      </div>

      <div class="row">
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">RG</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.rg ? data.rg : '<strong>N/D</strong>')"></span>
        </div>

        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">CPF</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.cpf ? data.cpf : '<strong>N/D</strong>')"></span>
        </div>
      </div>

      <h3 style="margin-top:20px; margin-bottom:15px; padding-left:20px;">Endereço</h3>
      
      <div class="row">
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Endereço</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.endereco ? data.endereco : '<strong>N/D</strong>')"></span>
        </div>
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Número</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.numero ? data.numero : '<strong>N/D</strong>')"></span>
        </div>
        
      </div>
    

      <div class="row">
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Bairro</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.bairro ? data.bairro : '<strong>N/D</strong>')"></span>
        </div>
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">CEP</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.cep ? data.cep : '<strong>N/D</strong>')"></span>
        </div>
      </div>


      <h3 style="margin-top:20px; margin-bottom:15px; padding-left:20px;">Cadastro VCG</h3>

      <div class="row">
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Nome no Cartão</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.nome_cartao ? data.nome_cartao : '<strong>N/D</strong>')"></span>
        </div>
        
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">ID VCG</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.id_vcg ? data.id_vcg : '<strong>N/D</strong>')"></span>
        </div>
      </div>

      <div class="row">
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Cadastro VCG</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.cadastro_vcg ? converterData(data.cadastro_vcg) : '<strong>N/D</strong>')"></span>
        </div>
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Data de Criação</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.created_at ? converterData(data.created_at) : '<strong>N/D</strong>')"></span>
        </div>
      </div>

      <div class="row">
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Data de Atualização</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.updated_at ? converterData(data.updated_at) : '<strong>N/D</strong>')"></span>
        </div>
        <div class="col input-group mb-3 d-flex justify-content-center">
            <span class="input-group-text">Status de Cadastro</span>
            <span class="input-group-text col text-center" id="respostaDetalhes" v-html="(data.status_cadastro ? data.status_cadastro : '<strong>N/D</strong>')"></span>
        </div>
      </div>

    </div>

</div>    
`
}