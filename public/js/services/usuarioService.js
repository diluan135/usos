export default {
    async getUsuario(pageNumber, qttPerPage, order) {
        try {
            const response = await axios.get(`/api/usuario?page=${pageNumber}`, {
                params: {
                    page: pageNumber,
                    qttPerPage: qttPerPage || 500,
                    order: order,
                },
            });
            return response;
        } catch (error) {
            console.error('Erro ao retornar dados da tabela de usuário', error);
            throw error;
        }
    },

    async getUsuarioDetalhe(id) {
        try {
            const response = await axios.get(`/api/usuarioDetalhe/${id}`);
            return response;
        } catch (error) {
            // console.error('Erro ao retornar dados da tabela de usuário', error);
            return undefined;
        }
    }
}