<?php

namespace App\Http\Controllers;

use App\Models\Linha;
use App\Models\Uso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class SearchController extends Controller
{
    public function search($table, $searchQuery, $coluna, Request $request)
    {
        try {
            if (!empty($searchQuery)) {

                $perPage = $request->get('qttPerPage');
                $dataInicio = $request->get('dataInicio');
                $dataFim = $request->get('dataFim');
                $page = $request->get('page', 1);
                $order = $request->get('order');
                $keywords = explode(' ', $searchQuery);

                $colunaParaCache = 'linha_' . $order; // Usando uma variável diferente para a coluna do cache
                $minutes = 60;

                $cachedColuna = Cache::get($colunaParaCache);
                
                if (in_array($table, ['uso_cartao_0', 'uso_cartao_1', 'uso_cartao_2', 'uso_cartao_3', 'uso_cartao_4', 'uso_cartao_5'])) {
                    if ($dataInicio) {
                        $query = DB::table($table)->select(
                            "$table.id",
                            "$table.horario",
                            'linha.nome as nome_linha',
                            "$table.cartao_id",
                            'dia_transporte.dia',
                            "$table.integracao",
                            "$table.prefixo_veiculo"
                        )
                            ->join('dia_transporte', "$table.dia_transporte_id", '=', 'dia_transporte.id')
                            ->join('linha', "$table.linha_id", '=', 'linha.id')
                            ->where('dia_transporte.dia', '=', $dataInicio);
                    } else {
                        $query = DB::table($table)->select(
                            "$table.id",
                            "$table.horario",
                            'linha.nome as nome_linha',
                            "$table.cartao_id",
                            'dia_transporte.dia',
                            "$table.integracao",
                            "$table.prefixo_veiculo"
                        )
                            ->join('dia_transporte', "$table.dia_transporte_id", '=', 'dia_transporte.id')
                            ->join('linha', "$table.linha_id", '=', 'linha.id');
                    }

                    if ($coluna == "linha_id") {
                        $keywords = Linha::where('nome', 'like', '%' . $searchQuery . '%')->pluck('id');

                        $count = $query->where(function ($query) use ($keywords, $coluna, $table) {
                            $query->whereIn("$table.{$coluna}", $keywords);
                        });
                    } else {
                        $count = $query->where(function ($query) use ($keywords, $coluna, $table) {
                            foreach ($keywords as $keyword) {
                                $query->orWhere("$table.{$coluna}", 'LIKE', '%' . $keyword . '%');
                            }
                        });
                    }

                    if ($order) {
                        if ($cachedColuna == $order) {
                            $count = $count->orderBy($order, "desc");
                            Cache::forget($colunaParaCache);
                        } else {
                            $count = $count->orderBy($order, 'asc');
                            Cache::remember($colunaParaCache, $minutes, function () use ($order) {
                                return $order;
                            });
                        }
                    }

                    $results = $count->skip(($page - 1) * $perPage)
                        ->take($perPage)
                        ->get();

                    return response()->json([
                        'data' => $results,
                        'pagination' => [
                            'data' => [
                                'total' => $count->count(),
                            ],
                        ],
                    ]);
                } elseif ($table === 'usuario') {
                    $query = DB::table('usuario')->select('id', 'nome', 'telefone', 'email');
                } else {
                    $query = DB::table($table);
                }

                $count = $query->where(function ($query) use ($keywords, $coluna) {
                    foreach ($keywords as $keyword) {
                        $query->where($coluna, 'LIKE', '%' . $keyword . '%');
                    }
                });

                $results = $count->skip(($page - 1) * $perPage)
                    ->take($perPage)
                    ->get();

                return response()->json([
                    'data' => $results,
                    'pagination' => [
                        'data' => [
                            'total' => $count->count(),
                        ],
                    ],
                ]);
            } else {
                return response()->json(["Campo de pesquisa vazio."]);
            }
        } catch (\Exception $e) {
            Log::error('Erro na pesquisa: ' . $e->getMessage());
            return response()->json(['error' => $e], 500);
        }
    }
}
