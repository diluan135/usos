<?php

namespace App\Http\Controllers;

use App\Models\Uso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use PhpParser\Node\Stmt\TryCatch;

class UsoController extends Controller
{
    public function pagination(Request $request)
    {
        $perPage = 500; // Tamanho do chunk (quantos registros por vez)

        $total = Cache::remember('total_usos', now()->addMinutes(10), function () {
            return Uso::count();
        });

        $lastPage = ceil($total / $perPage);

        $paginationData = [
            'total' => $total,
            'per_page' => $perPage,
            'last_page' => $lastPage,
        ];

        return response()->json($paginationData);
    }


    public function index(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $perPage = 500; // Tamanho do chunk (quantos registros por vez)

            $query = Uso::join('linha', 'uso_cartao.linha_id', '=', 'linha.id') // Inner join com a tabela 'linha'
                ->join('dia_transporte', 'uso_cartao.dia_transporte_id', '=', 'dia_transporte.id')
                ->select('uso_cartao.id', 'uso_cartao.horario', 'linha.nome as nome_linha', 'uso_cartao.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao.integracao', 'uso_cartao.prefixo_veiculo');

            $uso = $query
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json(['data' => $uso]);
        } catch (\Throwable $e) {
            return $e;
        }
    }



    public function getCartao($id)
    {
        try {
            $usoCartao = Uso::findOrFail($id); // Lança uma exceção se o registro não for encontrado
            $cartaoId = $usoCartao->cartao_id;
            return response()->json(['cartao_id' => $cartaoId]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $ex) {
            // Registro não encontrado
            return response()->json(['error' => 'Registro não encontrado'], 404);
        } catch (\Exception $ex) {
            // Outro erro inesperado
            return response()->json(['error' => 'Ocorreu um erro inesperado'], 500);
        }
    }

    public function getUsoUsuarioLinha(Request $request, $id)
    {
        try {
            $perPage = $request->get('qttPerPage');
            $page = $request->get('pageNumber');

            $count = Uso::join('cartao', 'uso_cartao.cartao_id', '=', 'cartao.id')
                ->join('usuario', 'cartao.usuario_id', '=', 'usuario.id')
                ->where('usuario.id', $id);

            $usoUsuario = Uso::join('cartao', 'uso_cartao.cartao_id', '=', 'cartao.id')
                ->join('usuario', 'cartao.usuario_id', '=', 'usuario.id')
                ->where('usuario.id', $id)
                ->join('dia_transporte', 'uso_cartao.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao.linha_id', '=', 'linha.id')
                ->select(
                    'uso_cartao.id',
                    'uso_cartao.horario',
                    'linha.nome as nome_linha',
                    'uso_cartao.cartao_id',
                    'dia_transporte.dia as dia_uso',
                    'uso_cartao.integracao',
                    'uso_cartao.prefixo_veiculo'
                )
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'data' => $usoUsuario,
                'pagination' => [
                    'data' => [
                        'total' => $count->count(),
                    ],
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erro interno'], 500);
        }
    }

    public function getUsoLinha(Request $request, $id)
    {

        try {
            $perPage = $request->get('qttPerPage');
            $page = $request->get('page', 1);

            $response = Uso::where('linha_id', $id);

            $uso = $response->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            $uso = Uso::join('dia_transporte', 'uso_cartao.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao.linha_id', '=', 'linha.id')
                ->select('uso_cartao.id', 'uso_cartao.horario', 'linha.nome as nome_linha', 'uso_cartao.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao.integracao', 'uso_cartao.prefixo_veiculo')
                ->whereIn('uso_cartao.id', $uso->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                ->get();

            return response()->json([
                'data' => $uso,
                'pagination' => [
                    'data' => [
                        'total' => $response->count(),
                    ],
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }
    }

    public function getUsoUsuario(Request $request, $id)
    {
        try {

            $page = $request->get('page', 1);
            $perPage = $request->get('qttPerPage');
            $usuario = Uso::where('cartao_id', $id)
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            $usuario = Uso::join('dia_transporte', 'uso_cartao.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao.linha_id', '=', 'linha.id')
                ->select('uso_cartao.id', 'uso_cartao.horario', 'linha.nome as nome_linha', 'uso_cartao.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao.integracao', 'uso_cartao.prefixo_veiculo')
                ->whereIn('uso_cartao.id', $usuario->pluck('id'))
                ->get();

            return response()->json([
                'data' => $usuario,
                'pagination' => [
                    'data' => [
                        'total' => $usuario->count(),
                    ],
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Usos do cartão não encontrados'], 404);
        }
    }
}
