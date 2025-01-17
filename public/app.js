import listaMenu from './js/components/listaMenu.js'
import detalhes from './js/components/detalhes.js';
import table from './js/components/table.js'
import linhaService from './js/services/linhaService.js';
import cartaoService from './js/services/cartaoService.js';
import categoriaService from './js/services/categoriaService.js';
import usoService from './js/services/usoService.js';
import usoService2019 from './js/services/usoService2019.js';
import usoService2020 from './js/services/usoService2020.js';
import usoService2021 from './js/services/usoService2021.js';
import usoService2022 from './js/services/usoService2022.js';
import usoService2023 from './js/services/usoService2023.js';
import usuarioService from './js/services/usuarioService.js';

const routes = [
  { path: '/', redirect: '/cartao' },

  {
    //tudo menos carteira
    path: '/usuario', component: table,
    props: (route) => {
      const pageNumber = route.query.page || 1;
      return {
        dataFunction: async (pageNumber, qttPerPage, order) => {
          try {
            const usuario = await usuarioService.getUsuario(pageNumber, qttPerPage, order);
            return usuario;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usuários', bd: 'usuario' },
        actions: [{ link: '/detalhes', name: 'Ver detalhes' }, { link: '/usuario_utilizacao', name: 'Ver usos' }],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Nome', bd: 'nome' },
          { name: 'Número para contato', bd: 'telefone' },
          { name: 'Email', bd: 'email' }
        ]
      }
    }
  },
  {
    //tudo menos carteira
    path: '/usuario_utilizacao/:id', component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.query.page || 1;
      return {
        dataFunction: async (pageNumber, qttPerPage) => {
          try {
            const usuario = await usoService.getUsuarioUtilizacao(id, pageNumber, qttPerPage);
            console.log(usuario);
            return usuario;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'Usos do usuario', bd: 'uso_cartao' },
        actions: [],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'linha_id' },
          { name: 'ID do cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_transporte_id' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo', bd: 'prefixo_veiculo' }
        ]
      }
    }
  },

  {
    path: '/linha', component: table,
    props: (route) => {
      const pageNumber = route.query.page || 1;
      return {
        dataFunction: async (pageNumber, qttPerPage, coluna) => {
          try {
            const linhas = await linhaService.getLinhas(pageNumber, qttPerPage, coluna);
            return linhas;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'linhas', bd: 'linha' },
        actions: [{ link: '/usuario_linha_2023', name: 'Ver usuários da linha' }], // Adicione ações, se necessário
        titles: [{ name: 'ID', bd: 'id' }, { name: 'Nome', bd: 'nome' }], // Defina os títulos das colunas
      }
    },

  },
  {
    path: '/usuario_linha_2019/:id',
    component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage) => {
          try {
            const categoria = await usoService2019.getUsuarioLinha(id, pageNumber, dataStart, dataEnd, qttPerPage);
            return categoria;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_0' },
        actions: [],
        titles: [
          { name: 'ID uso', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'nome_linha' },
          { name: 'ID cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_uso' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo do veículo', bd: 'prefixo_veiculo' }
        ],
      };
    },
  },
  {
    path: '/usuario_linha_2020/:id',
    component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage) => {
          try {
            const categoria = await usoService2020.getUsuarioLinha(id, pageNumber, dataStart, dataEnd, qttPerPage);
            return categoria;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_1' },
        actions: [],
        titles: [
          { name: 'ID uso', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'nome_linha' },
          { name: 'ID cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_uso' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo do veículo', bd: 'prefixo_veiculo' }
        ],
      };
    },
  },
  {
    path: '/usuario_linha_2021/:id',
    component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage) => {
          try {
            const categoria = await usoService2021.getUsuarioLinha(id, pageNumber, dataStart, dataEnd, qttPerPage);
            return categoria;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_2' },
        actions: [],
        titles: [
          { name: 'ID uso', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'nome_linha' },
          { name: 'ID cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_uso' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo do veículo', bd: 'prefixo_veiculo' }
        ],
      };
    },
  },
  {
    path: '/usuario_linha_2022/:id',
    component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, qttPerPage) => {
          try {
            const categoria = await usoService2022.getUsuarioLinha(id, pageNumber, qttPerPage);
            return categoria;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_3' },
        actions: [],
        titles: [
          { name: 'ID uso', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'nome_linha' },
          { name: 'ID cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_uso' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo do veículo', bd: 'prefixo_veiculo' }
        ],
      };
    },
  },


  {
    path: '/usuario_linha_2023/:id',
    component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage) => {
          try {
            const categoria = await usoService2023.getUsuarioLinha(id, pageNumber, dataStart, dataEnd, qttPerPage);
            return categoria;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_4' },
        actions: [],
        titles: [
          { name: 'ID uso', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'nome_linha' },
          { name: 'ID cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_uso' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo do veículo', bd: 'prefixo_veiculo' }
        ],
      };
    },
  },


  {
    path: '/cartao', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1
      return {
        dataFunction: async (pageNumber, qttPerPage, order) => {
          try {
            const cartoes = await cartaoService.getCartoes(pageNumber, qttPerPage, order);
            return cartoes;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'cartões', bd: 'cartao' },
        actions: [{ link: '/detalhes/:{id}', name: 'usuário' }, { link: '/utilizacao/:{id}', name: 'utilização' }], // Adicione ações, se necessário
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Número de série', bd: 'numero_serie' },
          { name: 'Número de fábrica', bd: 'numero_fabrica' },
          { name: 'Habilitado em', bd: 'habilitado_em' },
          { name: 'ID do usuário', bd: 'usuario_id' },
          { name: 'Criado em', bd: 'created_at' },
          { name: 'Atualizado em', bd: 'updated_at' },
          { name: 'categoria do cartão', bd: 'categoria_id' }
        ],
      }
    }
  },

  {
    path: '/utilizacao/:id', component: table,
    props: (route) => {
      const id = route.params.id;
      const pageNumber = route.params.page;
      return {
        dataFunction: async (pageNumber, qttPerPage) => {
          try {
            const usuario = await usoService.getUsoUsuario(id, pageNumber, qttPerPage);
            return usuario;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_0' },
        actions: [],
        titles:
          [
            { name: 'ID', bd: 'id' },
            { name: 'Horário', bd: 'horario' },
            { name: 'ID da linha', bd: 'linha_id' },
            { name: 'ID do cartão', bd: 'cartao_id' },
            { name: 'Dia do uso', bd: 'dia_transporte_id' },
            { name: 'Integração', bd: 'integracao' },
            { name: 'Prefixo do veículo', bd: 'prefixo_veiculo' }
          ],

      }
    }
  },

  {
    path: '/utilizacao/:any/:id',
    props: route => ({ id: route.params.id }), // Passa o valor de :id como uma propriedade chamada id
    redirect: to => `/utilizacao/${to.params.id}`
  },

  {
    path: '/categoria', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, qttPerPage, order) => {
          try {
            const categoria = await categoriaService.getCategoria(pageNumber, qttPerPage, order);
            return categoria;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'categorias', bd: 'categoria_cartao' },
        actions: [], // Adicione ações, se necessário
        titles: [{ name: 'ID', bd: 'id' }, { name: 'Categoria do cartão', bd: 'nome' }], // Defina os títulos das colunas
      }
    }
  },
  {
    path: '/uso2019', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage, order) => {
          try {
            const uso = await usoService2019.getUso(pageNumber, dataStart, dataEnd, qttPerPage, order);
            return uso;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_0' },
        actions: [
          // {
          //   name: 'Ver usuário',
          //   link: '/detalhes/:{id}'
          // },
        ],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'linha_id' },
          { name: 'ID do cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_transporte_id' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo', bd: 'prefixo_veiculo' }
        ]
      }
    }
  },
  {
    path: '/uso2020', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage, order) => {
          try {
            const uso = await usoService2020.getUso(pageNumber, dataStart, dataEnd, qttPerPage, order);
            return uso;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_1' },
        actions: [],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'linha_id' },
          { name: 'ID do cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_transporte_id' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo', bd: 'prefixo_veiculo' }
        ]
      }
    }
  },
  {
    path: '/uso2021', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage, order) => {
          try {
            const uso = await usoService2021.getUso(pageNumber, dataStart, dataEnd, qttPerPage, order);
            return uso;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_2' },
        actions: [],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'linha_id' },
          { name: 'ID do cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_transporte_id' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo', bd: 'prefixo_veiculo' }
        ]
      }
    }
  },
  {
    path: '/uso2022', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage, order) => {
          try {
            const uso = await usoService2022.getUso(pageNumber, dataStart, dataEnd, qttPerPage, order);
            return uso;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_3' },
        actions: [],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'linha_id' },
          { name: 'ID do cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_transporte_id' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo', bd: 'prefixo_veiculo' }
        ]
      }
    }
  },
  {
    path: '/uso2023', component: table,
    props: (route) => {
      const pageNumber = route.params.page || 1;
      return {
        dataFunction: async (pageNumber, dataStart, dataEnd, qttPerPage, order) => {
          try {
            const uso = await usoService2023.getUso(pageNumber, dataStart, dataEnd, qttPerPage, order);
            return uso;
          } catch (error) {
            console.error('Ocorreu um erro', error);
            return undefined;
          }
        },
        tabela: { name: 'usos do cartão', bd: 'uso_cartao_4' },
        actions: [],
        titles: [
          { name: 'ID', bd: 'id' },
          { name: 'Horário', bd: 'horario' },
          { name: 'Nome da linha', bd: 'linha_id' },
          { name: 'ID do cartão', bd: 'cartao_id' },
          { name: 'Dia do uso', bd: 'dia_transporte_id' },
          { name: 'Integração', bd: 'integracao' },
          { name: 'Prefixo', bd: 'prefixo_veiculo' }
        ]
      }
    }
  },
  {
    path: '/detalhes/:any/:id',
    props: route => ({ id: route.params.id }), // Passa o valor de :id como uma propriedade chamada id
    redirect: to => `/detalhes/${to.params.id}`
  },
  {
    path: '/detalhes/:id', component: detalhes,
    props: route => ({
      id: route.params.id,
      dataFunction: async () => {
        try {
          const usuario = await usuarioService.getUsuarioDetalhe(route.params.id);
          return usuario;
        } catch (error) {
          console.error('Ocorreu um erro', error);
          return undefined;
        }
      },
    })
  },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes
})

const app = Vue.createApp({
  components: {
    'lista-menu': listaMenu,
  },
})

app.use(router)
app.mount('#app')