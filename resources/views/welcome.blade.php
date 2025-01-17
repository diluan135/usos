<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="/images/logo.png" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="/css/vue_transitions.css">
    <link rel="stylesheet" href="/lib/css/utilites.css" />
    <link rel="stylesheet" href="/lib/css/main.css" /> 
    <title>Uso transporte</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/3811bbfd96.js" crossorigin="anonymous"></script>
</head>

<body>
    <div id="app">
    <div class="container-fluid">
            <div class="row" style="background:#ebebeb;;">
                <div id="lateral">
                    <lista-menu />
                </div>
                <div class="painel">
                    <router-view :key="$route.path" v-slot="{ Component }">
                        <transition mode="out-in" name="slide-fade">
                            <component :is="Component" />
                        </transition>
                        
                    </router-view>
                </div>
            </div>
        </div>  
    </div>
</body>
<!-- Arquivo principal do vuejs -->
<script type="module" src="/app.js"></script>
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/vue-router@4"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
</html>