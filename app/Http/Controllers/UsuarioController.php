<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Cache;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $page = $request->get('page', 1);
        $perPage = $request->get('qttPerPage');
        $order = $request->get('order');
        $orderType = Cache::get('order_type', 'asc');
        $colunaParaCache = 'cartao_' . $order; // Usando uma variável diferente para a coluna do cache
        $paginaParaCache = 'pagina_' . $page;
        $minutes = 60;
        $columns = ['id', 'nome', 'telefone', 'email'];

        // Se uma nova coluna é clicada, inverte a direção da ordenação
        if ($order && ($page == $paginaParaCache || $page == 1)) {
            $orderType = ($orderType === 'asc') ? 'desc' : 'asc';
        }

        $usuarios = Usuario::orderBy($order ?: 'id', $orderType)->select($columns);

        $usuarios = $usuarios->paginate($perPage)->toArray();

        Cache::put($colunaParaCache, $order, $minutes);
        Cache::put('order_type', $orderType, $minutes);
        Cache::remember($paginaParaCache, $minutes, function () use ($page) {
            return $page;
        });

        return response()->json($usuarios);
    }


    public function detalhe($id)
    {
        try {
            $usuario = Usuario::findOrFail($id);
            return response()->json($usuario);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json(['message' => 'Usuário não encontrado'], 404);
        }
    }
}
