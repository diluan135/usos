// linhaService.js
// import axios from 'axios';

export default {
    async getCategoria(pageNumber, qttPerPage, order) {
      try {
        const response = await axios.get(`/api/categoria_cartao?page=${pageNumber}`, {
          params: {
              page: pageNumber,
              qttPerPage: qttPerPage || 500,
              order: order,
          },
      });
        return response;
      } catch (error) {
        console.error('Erro ao buscar dados da tabela de linha:', error);
        throw error;
      }
    },
  };
  