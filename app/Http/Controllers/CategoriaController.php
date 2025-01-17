<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('qttPerPage');
        $page = $request->get('page', 1);
        $order = $request->get('order');

        $colunaParaCache = 'cartao_' . $order; // Usando uma variável diferente para a coluna do cache
        $paginaParaCache = 'pagina_' . $page;
        $minutes = 60;

        $cachedColuna = Cache::get($colunaParaCache);
        $cachedPage = Cache::get($paginaParaCache);

        if ($order) {
            if ($cachedColuna == $order) {
                $categorias = Categoria::orderBy($order, "desc");
                if ($cachedPage == $page || $page == 1) {
                    Cache::forget($colunaParaCache);
                }
            } else {
                $categorias = Categoria::orderBy($order, 'asc');
                if ($cachedPage == $page || $page == 1) {
                    Cache::remember($colunaParaCache, $minutes, function () use ($order) {
                        return $order;
                    });
                }
            }

            $categorias = $categorias->paginate($perPage)->toArray();

            Cache::remember($paginaParaCache, $minutes, function () use ($page) {
                return $page;
            });

            return response()->json($categorias);
        }

        $categorias = Categoria::paginate($perPage)->toArray();
        return response()->json($categorias);
    }
}
