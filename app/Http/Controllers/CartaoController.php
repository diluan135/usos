<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cartao;
use Illuminate\Support\Facades\Cache;

class CartaoController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->get('qttPerPage');
        $page = $request->get('page', 1);
        $order = $request->get('order');
        $orderType = Cache::get('order_type', 'asc');
        $colunaParaCache = 'cartao_' . $order; // Usando uma variável diferente para a coluna do cache
        $paginaParaCache = 'pagina_' . $page;
        $minutes = 60;

        // Se uma nova coluna é clicada, inverte a direção da ordenação
        if ($order && ($page == $paginaParaCache || $page == 1)) {
            $orderType = ($orderType === 'asc') ? 'desc' : 'asc';
        }

        $cartoes = Cartao::orderBy($order ?: 'id', $orderType);

        $cartoes = $cartoes->paginate($perPage)->toArray();

        Cache::put($colunaParaCache, $order, $minutes);
        Cache::put('order_type', $orderType, $minutes);
        Cache::remember($paginaParaCache, $minutes, function () use ($page) {
            return $page;
        });

        return response()->json($cartoes);
    }


    public function getUsuario($id)
    {
        $usuario = Cartao::find($id);
        $id_usuario = $usuario->usuario_id;
        return response()->json(['usuario_id' => $id_usuario]);
    }
}
