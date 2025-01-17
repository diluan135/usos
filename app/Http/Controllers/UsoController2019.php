<?php

namespace App\Http\Controllers;

use App\Models\Uso2019;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

// A consulta da Query é feita em duas partes (o join linha feito na segunda) porque há um erro de ordenação caso for feito tudo de uma vez

class UsoController2019 extends Controller
{
    public function pagination(Request $request)
    {

        $dataInicio = $request->get('dataInicio');
        $dataFim = $request->get('dataFim');
        $total = 0; // Defina $total fora do bloco if-else
        $perPage = $request->get('qttPerPage');

        if ($dataInicio != '2019-01-01') {

            if ($dataFim != '2019-12-31') {

                $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')->whereBetween('dia_transporte.dia', [$dataInicio, $dataFim]);

                $subQuery = clone $query; // Clone a consulta para evitar que o whereBetween afete a subconsulta
                $maxId = $subQuery->max('uso_cartao_0.id');
                $minId = $subQuery->min('uso_cartao_0.id');

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

                $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')->where('dia_transporte.dia', '=', $dataInicio);

                $subQuery = clone $query; // Clone a consulta para evitar que o whereBetween afete a subconsulta
                $maxId = $subQuery->max('uso_cartao_0.id');
                $minId = $subQuery->min('uso_cartao_0.id');

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

            $total = Cache::remember('total_usos_2019', now()->addMinutes(10), function () {
                return Uso2019::count();
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
            $getOrder = $request->get('order', 'id');
            $order = Cache::get('order', $getOrder);
            $orderType = Cache::get('order_type', 'asc');
            $coluna = 'uso_cartao_0.' . $order;
            $minutes = 60;

            Log::info('Variáveis da requisição:');
            Log::info(' - Página: ' . $page);
            Log::info(' - Data de Início: ' . $dataInicio);
            Log::info(' - Data de Fim: ' . $dataFim);
            Log::info(' - Itens por Página: ' . $perPage);
            Log::info(' - Ordem: ' . $order);
            Log::info(' - Tipo de Ordem: ' . $orderType);
            Log::info(' - Coluna: ' . $coluna);

            $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id');

            if ($order && $page == 1) {
                $orderType = ($orderType === 'asc') ? 'desc' : 'asc';
            }


            if ($dataInicio != '2019-01-01' || $dataFim != '2019-12-31') {
                if ($dataFim == '2019-12-31') {


                    $query = $query->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'uso_cartao_0.linha_id', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->orderBy($order ?: 'id', $orderType)
                        ->where('dia_transporte.dia', '=', $dataInicio)
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();

                    $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_0.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'linha.nome as nome_linha', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->whereIn('uso_cartao_0.id', $query->pluck('id'));

                    $query = $query->orderBy($order ?: 'id', $orderType)->get();
                } else {
                    $query = $query->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'uso_cartao_0.linha_id', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->orderBy($order ?: 'id', $orderType)
                        ->whereBetween('dia_transporte.dia', [$dataInicio, $dataFim])
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();

                    $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_0.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'linha.nome as nome_linha', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->whereIn('uso_cartao_0.id', $query->pluck('id'));

                    $query = $query->orderBy($order ?: 'id', $orderType)->get();
                }


                Cache::put('order', $order, $minutes);
                Cache::put('order_type', $orderType, $minutes);

                return response()->json([
                    'data' => $query,
                    'dataContagem' => $query->count()
                ]);
            }

            Log::info('Coluna:' . $coluna . ' Order: ' . $order . ' orderType: ' . $orderType . ' página: ' . $page);

            // Executar a primeira parte da consulta
            $query = Uso2019::select($coluna)
                ->orderBy($order, $orderType)
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            $uniqueValues = $query->pluck($order)->unique()->toArray();
            Log::info('Resultados da primeira parte da consulta: ' . $query);
            Log::info('Valores únicos em $uniqueValues:', $uniqueValues);
            $query = Uso2019::whereIn($coluna, $uniqueValues)
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->orderBy($order, $orderType)
                ->join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao_0.linha_id', '=', 'linha.id')
                ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'linha.nome as nome_linha', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                ->get();

            Cache::put('order_type', $orderType, $minutes);

            Log::info('Resultados antes de retornar JSON: ' . $query);
            return response()->json([
                'data' => $query,
            ]);
        } catch (\Throwable $e) {
            return $e;
        }
    }


    public function getCartao($id)
    {
        try {
            $usoCartao = Uso2019::findOrFail($id);
            $cartaoId = $usoCartao->cartao_id;
            return response()->json(['cartao_id' => $cartaoId]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $ex) {
            return response()->json(['error' => 'Registro não encontrado'], 404);
        } catch (\Exception $ex) {
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


            if ($dataInicio != '2019-01-01' || $dataFim != '2019-12-31') {
                if ($dataFim == '2019-12-31') {

                    $quer = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                        ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'uso_cartao_0.linha_id', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->where('dia_transporte.dia', '=', $dataInicio)
                        ->where('linha_id', $id);

                    $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_0.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'linha.nome as nome_linha', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->whereIn('uso_cartao_0.id', $quer->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
                        ->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();
                } else {
                    $quer = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                        ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'uso_cartao_0.linha_id', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->whereBetween('dia_transporte.dia', [$dataInicio, $dataFim])
                        ->where('linha_id', $id);

                    $query = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                        ->join('linha', 'uso_cartao_0.linha_id', '=', 'linha.id')
                        ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'linha.nome as nome_linha', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                        ->whereIn('uso_cartao_0.id', $quer->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
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

            $response = Uso2019::where('linha_id', $id);

            $uso = $response->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            $uso = Uso2019::join('dia_transporte', 'uso_cartao_0.dia_transporte_id', '=', 'dia_transporte.id')
                ->join('linha', 'uso_cartao_0.linha_id', '=', 'linha.id')
                ->select('uso_cartao_0.id', 'uso_cartao_0.horario', 'linha.nome as nome_linha', 'uso_cartao_0.cartao_id', 'dia_transporte.dia as dia_uso', 'uso_cartao_0.integracao', 'uso_cartao_0.prefixo_veiculo')
                ->whereIn('uso_cartao_0.id', $uso->pluck('id')) // Filtra apenas os IDs obtidos na primeira parte
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
