export default {
    async getCartoes(pageNumber, qttPerPage, order) {
      try {
        const response = await axios.get(`/api/cartao?page=${pageNumber}`, {
          params: {
              page: pageNumber,
              qttPerPage: qttPerPage || 500,
              order: order
          },
      });
      console.log(response);
        return response;
      } catch (error) {
        console.error('Erro ao buscar dados da tabela de cartoes:', error);
        throw error;
      }
    },
    

    async getUsuario(id){
      try {
        const response = await axios.get(`/api/cartao/${id}`);
        return response;
    } catch (error) {
        console.error('Erro ao encontrar id_cartao em tabela uso_cartao', error);
        throw error;
    }
    }

  };
  
  