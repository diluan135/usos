export default {

    data() {
        return {
            pagination: [],
            dataStart: '2023-01-01',
            dataEnd: '2023-12-31',
        }
    },

    async getPagination(dataStart, dataEnd) {
        this.dataStart = dataStart;
        this.dataEnd = dataEnd;
        try {
            const response = await axios.get(`/api/uso_cartao_2023/pagination`, {
                params: {
                    dataInicio: this.dataStart || '2023-01-01',
                    dataFim: this.dataEnd || '2023-12-31',
                },
            });
            this.pagination = response;

            return this.pagination;
        } catch (error) {
            console.error('Erro ao fazer paginação', error);
            throw error;
        }
    },


    async getUso(pageNumber, dataStart, dataEnd, qttPerPage, order) {
        try {
            if (this.dataStart != dataStart || this.dataEnd != dataEnd) {
                this.dataStart = dataStart;
                this.dataEnd = dataEnd;
            }

            const apiResponse = await axios.get(`/api/uso_cartao_2023`, {
                params: {
                    page: pageNumber,
                    dataInicio: dataStart || '2023-01-01',
                    dataFim: dataEnd || '2023-12-31',
                    qttPerPage: qttPerPage || 500,
                    order: order
                },
            });

            if (!(this.pagination > 0)) {
                try {
                    const paginationResponse = await axios.get(`/api/uso_cartao_2023/pagination`, {
                        params: {
                            page: pageNumber,
                            dataInicio: this.dataStart || '2023-01-01',
                            dataFim: this.dataEnd || '2023-12-31',
                            qttPerPage: qttPerPage || 500
                        },
                    });
                    this.pagination = paginationResponse;
                    return {
                        data: apiResponse.data,
                        pagination: paginationResponse,
                    };
                } catch (paginationError) {
                    console.error('Erro ao fazer paginação', paginationError);
                    throw paginationError;
                }
            }

            return {
                data: apiResponse.data,
            };

        } catch (error) {
            console.error('Erro ao buscar dados da tabela de erro:', error);
            throw error;
        }

    },

    async encontrarUsuarioPorCartaoId(id){
        try {
            const response = await axios.get(`/api/uso_cartao_2023/${id}`);
            return response;
        } catch (error) {
            console.error('Erro ao encontrar id_cartao em tabela uso_cartao', error);
            throw error;
        }
    },

    async getUsoUsuario(id, pageNumber){
        try {
            const response = await axios.get(`/api/uso_usuario_2023/${id}?page=${pageNumber}`);
            return response;
        } catch (error) {
            console.error('Erro ao encontrar usos do cartão');
        }
    },

    async getUsuarioLinha(id, pageNumber, dataStart, dataEnd, qttPerPage){
        try {
            if (this.dataStart != dataStart || this.dataEnd != dataEnd) {
                this.dataStart = dataStart;
                this.dataEnd = dataEnd;
            }
            
            const response = await axios.get(`/api/uso_cartao_linha_2023/${id}?page=${pageNumber}`, {
                params: {
                    page: pageNumber,
                    dataInicio: this.dataStart || '2023-01-01',
                    dataFim: this.dataEnd || '2023-12-31',
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