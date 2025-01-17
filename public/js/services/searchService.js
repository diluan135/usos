export default {

    async search(busca, tabela, coluna, pagina, dataSelecionada, dataSelecionada2, qttPerPage, order) {
        try {
            let response;
            console.log(busca, tabela, coluna, pagina, dataSelecionada, dataSelecionada2, qttPerPage, order);
            if (dataSelecionada) {
                if (dataSelecionada2) {
                    response = await axios.get(`/api/search/${tabela}/${busca}/${coluna.bd}`, {
                        params: {
                            dataInicio: dataSelecionada,
                            dataFim: dataSelecionada2,
                            qttPerPage: qttPerPage || 500,
                            page: pagina,
                            order: order,
                        },
                    })
                } else {
                    response = await axios.get(`/api/search/${tabela}/${busca}/${coluna.bd}`, {
                        params: {
                            dataInicio: dataSelecionada,
                            qttPerPage: qttPerPage || 500,
                            page: pagina,
                            order: order,
                        },
                    })
                }
            } else {
                response = await axios.get(`/api/search/${tabela}/${busca}/${coluna.bd}`, {
                    params: {
                        qttPerPage: qttPerPage || 500,
                        page: pagina,
                        order: order,
                    },
                })
            }
            return {
                data: response.data || [],
                pagination: response.data.pagination || [],
            };
        } catch (error) {
            console.error('Erro ao buscar os dados', error);
            throw error; // Adicione esta linha para relançar o erro para que o componente possa lidar com ele, se necessário
        }

    },
}