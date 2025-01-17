export default {
  async getLinhas(pageNumber, qttPerPage, order) {
    try {
      console.log(pageNumber, qttPerPage, order);
      const response = await axios.get(`/api/linhas?page=${pageNumber}`, {
        params: {
            page: pageNumber,
            qttPerPage: qttPerPage || 500,
            order: order,
        },
    });
    console.log(response);

      return response;
    } catch (error) {
      console.error('Erro ao buscar dados da tabela de linha:', error);
      throw error;
    }
  },
}