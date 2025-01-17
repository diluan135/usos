<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LinhaController;
use App\Http\Controllers\CartaoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UsoController;
use App\Http\Controllers\UsoController2019;
use App\Http\Controllers\UsoController2020;
use App\Http\Controllers\UsoController2021;
use App\Http\Controllers\UsoController2022;
use App\Http\Controllers\UsoController2023;
use App\Http\Controllers\UsuarioController;

Route::get('/search/{table}/{searchedWord}/{coluna}', [SearchController::class, 'search']);

Route::get('/linhas', [LinhaController::class, 'index']);

Route::get('/cartao', [CartaoController::class, 'index']);
Route::get('/cartao/{id}', [CartaoController::class, 'getUsuario']);
Route::get('/categoria_cartao', [CategoriaController::class, 'index']);

Route::get('/uso_usuario/{id}', [UsoController::class, 'getUsoUsuario']);
Route::get('/uso_cartao_linha/{id}', [UsoController::class, 'getUsoLinha']);
Route::get('/uso_cartao_usuario_utilizacao/{id}', [UsoController::class, 'getUsoUsuarioLinha']);


Route::get('/uso_cartao_2019', [UsoController2019::class, 'index']);
Route::get('/uso_cartao_2019/pagination', [UsoController2019::class, 'pagination']);
Route::get('/uso_cartao_2019/{id}', [UsoController2019::class, 'getCartao']);
Route::get('/uso_cartao_linha_2019/{id}', [UsoController2019::class, 'getUsoLinha']);

Route::get('/uso_cartao_2020', [UsoController2020::class, 'index']);
Route::get('/uso_cartao_2020/pagination', [UsoController2020::class, 'pagination']);
Route::get('/uso_cartao_2020/{id}', [UsoController2020::class, 'getCartao']);
Route::get('/uso_cartao_linha_2020/{id}', [UsoController2020::class, 'getUsoLinha']);

Route::get('/uso_cartao_2021', [UsoController2021::class, 'index']);
Route::get('/uso_cartao_2021/pagination', [UsoController2021::class, 'pagination']);
Route::get('/uso_cartao_2021/{id}', [UsoController2021::class, 'getCartao']);
Route::get('/uso_cartao_linha_2021/{id}', [UsoController2021::class, 'getUsoLinha']);

Route::get('/uso_cartao_2022', [UsoController2022::class, 'index']);
Route::get('/uso_cartao_2022/pagination', [UsoController2022::class, 'pagination']);
Route::get('/uso_cartao_2022/{id}', [UsoController2022::class, 'getCartao']);
Route::get('/uso_cartao_linha_2022/{id}', [UsoController2022::class, 'getUsoLinha']);

Route::get('/uso_cartao_2023', [UsoController2023::class, 'index']);
Route::get('/uso_cartao_2023/pagination', [UsoController2023::class, 'pagination']);
Route::get('/uso_cartao_2023/{id}', [UsoController2023::class, 'getCartao']);
Route::get('/uso_cartao_linha_2023/{id}', [UsoController2023::class, 'getUsoLinha']);


Route::get('/usuario', [UsuarioController::class, 'index']);
Route::get('/usuarioDetalhe/{id}', [UsuarioController::class, 'detalhe']);


Route::middleware([AccessValidation::class])->group(function () {

    
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
});