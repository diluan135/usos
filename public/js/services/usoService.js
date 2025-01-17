export default {

    data() {
        return {
            pagination: [],
            dataStart: '2019-01-01',
            dataEnd: '2019-12-31',
        }
    },

    async getUso(pageNumber) {
      try {
        if(!(this.pagination > 0)){
            try {
                const response = await axios.get(`/api/uso_cartao/pagination`);
                this.pagination = response;
            } catch (error) {
                console.error('Erro ao fazer paginação', error);
                throw error;
            }
        }

        const response = await axios.get(`/api/uso_cartao?page=${pageNumber}`);
        return response; // Retorna somente os dados da resposta
      } catch (error) {
        console.error('Erro ao buscar dados da tabela de erro:', error);
        throw error; // Lança a exceção para lidar com erros no componente Vue.js
      }
    },
  

    async encontrarUsuarioPorCartaoId(id){
        try {
            const response = await axios.get(`/api/uso_cartao/${id}`);
            return response;
        } catch (error) {
            console.error('Erro ao encontrar id_cartao em tabela uso_cartao', error);
            throw error;
        }
    },

    async getUsoUsuario(id, pageNumber, qttPerPage){
        try {
            const response = await axios.get(`/api/uso_usuario/${id}`, {
                params: {
                    page: pageNumber,
                    qttPerPage: qttPerPage || 500
                },
            });
            console.log(response);
            return {
                data: response.data || [],
                pagination: response.data.pagination || [],

            };
        } catch (error) {
            console.error('Erro ao encontrar usos do cartão');
        }
    },

    async getUsuarioUtilizacao(id, pageNumber, qttPerPage){
        try {
            console.log("id: ", id, "page: ", pageNumber, "qtPerPage: ", qttPerPage);
            const response = await axios.get(`/api/uso_cartao_usuario_utilizacao/${id}`,{
                params: {
                    pageNumber : pageNumber,
                    qttPerPage : qttPerPage || 500
                },
            });
            return {
                data: response.data || [],
                pagination: response.data.pagination || [],
            }
        } catch (error) {
            console.error(`Erro ao encontrar utilizações do usuário com id ${id}`)
            throw error;
        }
    },

    async getUsuarioLinha(id, pageNumber, qttPerPage){
        try {
            const response = await axios.get(`/api/uso_cartao_linha/${id}?page=${pageNumber}`, {
                params: {
                    page: pageNumber,
                    qttPerPage: qttPerPage || 500
                },
            });
            return {
                data: response.data || [],
                pagination: response.data.pagination || [],

            };
        } catch (error) {
            console.error('Erro ao encontrar usuários que utilizam a linha', id);
            throw error;
        }
    }

}