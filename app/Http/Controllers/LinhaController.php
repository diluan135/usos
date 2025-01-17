<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use App\Models\Linha;

class LinhaController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('qttPerPage');
        $order = $request->get('order');
        $orderType = Cache::get('order_type', 'asc');
        $paginaParaCache = 'pagina_' . $page;
        $minutes = 60;

        // Se uma nova coluna é clicada, inverte a direção da ordenação
        if ($order && ($page == $paginaParaCache || $page == 1)) {
            $orderType = ($orderType === 'asc') ? 'desc' : 'asc';
        }

        $linhas = Linha::orderBy($order ?: 'id', $orderType);

        $linhas = $linhas->paginate($perPage);

        Cache::put('order_type', $orderType, $minutes);
        Cache::remember($paginaParaCache, $minutes, function () use ($page) {
            return $page;
        });

        return response()->json([
            'data' => $linhas->items(),
            'pagination' => [
                'data' => [
                    'total' => $linhas->total(),
                ],
            ],
        ]);
    }
}
