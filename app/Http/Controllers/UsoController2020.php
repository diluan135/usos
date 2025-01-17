<?php

namespace App\Http\Controllers;

use App\Models\Uso2020;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class UsoController2020 extends Controller
{
    public function pagination(Request $request)
    {

        $dataInicio = $request->get('dataInicio');
        $dataFim = $request->get('dataFim');
        $total = 0; // Defina $total fora do bloco if-else
        $perPage = $request->get('qttPerPage');

        if ($dataInicio != '2020-01-01') {

            if ($dataFim != '2020-12-31') {

                $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')->whereBetween('dia_transporte.dia', [$dataInicio, $dataFim]);

                    $subQuery = clone $query; // Clone a consulta para evitar que o whereBetween afete a subconsulta
                    $maxId = $subQuery->max('uso_cartao_1.id');
                    $minId = $subQuery->min('uso_cartao_1.id');
    
                    $total = ($maxId - $minId) + 1;  // Calcula o total
    
                    $lastPage = ceil($total / $perPage);
    
                    $paginationData = [
                        'total' => $total,
                        'max' => $maxId,
                        'min' => $minId,
                        'inicio' => $dataInicio,
                        'fim' => $dataFim,
                        'per_page' => $perPage
                    ];
                return response()->json($paginationData);

            } else {

                $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')->where('dia_transporte.dia', '=', $dataInicio);;

                $subQuery = clone $query; // Clone a consulta para evitar que o whereBetween afete a subconsulta
                $maxId = $subQuery->max('uso_cartao_1.id');
                $minId = $subQuery->min('uso_cartao_1.id');

                $total = ($maxId - $minId) + 1;  // Calcula o total

                $lastPage = ceil($total / $perPage);

                $paginationData = [
                    'total' => $total,
                    'max' => $maxId,
                    'min' => $minId,
                    'inicio' => $dataInicio,
                    'fim' => $dataFim,
                    'per_page' => $perPage
                ];

                return response()->json($paginationData);
            }
        } else {

            $total = Cache::remember('total_usos_2020', now()->addMinutes(10), function () {
                return Uso2020::count();
            });

            $lastPage = ceil($total / $perPage);

            $paginationData = [
                'total' => $total,
                'dataInicio' => $dataInicio,
                'last_page' => $lastPage,
            ];

            return response()->json($paginationData);
        }
    }

    public function index(Request $request)
    {
        try {
            $page = $request->get('page', 1);
            $dataInicio = $request->get('dataInicio');
            $dataFim = $request->get('dataFim');
            $perPage = $request->get('qttPerPage');
            $order = $request->get('order');

            $colunaParaCache = 'linha_' . $order; // Usando uma variável diferente para a coluna do cache
            $minutes = 60;

            $cachedColuna = Cache::get($colunaParaCache);

            $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id');

            if ($order) {
                if ($cachedColuna == $order) {
                    $query = $query->orderBy($order, "desc");
                    Cache::forget($colunaParaCache);
                } else {
                    $query = $query->orderBy($order, 'asc');
                    Cache::remember($colunaParaCache, $minutes, function () use ($order) {
                        return $order;
                    });
                }
            }

            if ($dataInicio != '2020-01-01' || $dataFim != '2020-12-31') {
                if ($dataFim == '2020-12-31') {
                    $query = $query->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'uso_cartao_1.linha_id', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->where('dia_transporte.dia', '=', $dataInicio)
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();

                    $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_1.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'linha.nome as nome_linha', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->whereIn('uso_cartao_1.id', $query->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                        ->get();
                } else {
                    $query = $query->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'uso_cartao_1.linha_id', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->whereBetween('dia_transporte.dia', [$dataInicio, $dataFim])
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();

                    $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_1.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'linha.nome as nome_linha', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->whereIn('uso_cartao_1.id', $query->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                        ->get();
                }

                return response()->json([
                    'data' => $query,
                    'dataContagem' => $query->count()
                ]);
            }

            // Primeira parte da consulta
            $query = $query->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'uso_cartao_1.linha_id', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            // Segunda parte da consulta
            $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao_1.linha_id', '=', 'linha.id')
                ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'linha.nome as nome_linha', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                ->whereIn('uso_cartao_1.id', $query->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                ->get();

            return response()->json([
                'data' => $query,
            ]);
        } catch (\Throwable $e) {
            return $e;
        }
    }

    public function getCartao($id){
        try {
            $usoCartao = Uso2020::findOrFail($id); // Lança uma exceção se o registro não for encontrado
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
    public function getUsoLinha(Request $request, $id)
    {

        try {

            $perPage = $request->get('qttPerPage');
            $dataInicio = $request->get('dataInicio');
            $dataFim = $request->get('dataFim');
            $page = $request->get('page', 1);


            if ($dataInicio != '2020-01-01' || $dataFim != '2020-12-31') {
                if ($dataFim == '2020-12-31') {

                    $quer = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                        ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'uso_cartao_1.linha_id', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->where('dia_transporte.dia', '=', $dataInicio)
                        ->where('linha_id', $id);

                    $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_1.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'linha.nome as nome_linha', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->whereIn('uso_cartao_1.id', $quer->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();

                } else {
                    $quer = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                        ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'uso_cartao_1.linha_id', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->whereBetween('dia_transporte.dia', [$dataInicio, $dataFim])
                        ->where('linha_id', $id);

                    $query = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_1.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'linha.nome as nome_linha', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                        ->whereIn('uso_cartao_1.id', $quer->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();
                }

                return response()->json([
                    'data' => $query,
                    'pagination' => [
                        'data' => [
                            'total' => $quer->count(),
                        ],
                    ],
                ]);
            }
            
            $response = Uso2020::where('linha_id', $id);

            $uso = $response->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            $uso = Uso2020::join('dia_transporte', 'uso_cartao_1.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao_1.linha_id', '=', 'linha.id')
                ->select('uso_cartao_1.id', 'uso_cartao_1.horario', 'linha.nome as nome_linha', 'uso_cartao_1.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_1.integracao', 'uso_cartao_1.prefixo_veiculo')
                ->whereIn('uso_cartao_1.id', $uso->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
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
}
