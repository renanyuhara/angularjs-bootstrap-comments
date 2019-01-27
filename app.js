var app = angular.module('myApp',[]);

app.controller('appController', function ($scope, $http) {

    $scope.titulo = 'Comentários';
    $scope.lista_de_comentarios = [];
    $scope.lista_para_exibicao = [];
    $scope.lista_de_posts = [];
    $scope.pagina_atual = 1;
    $scope.qtde_registros_por_pagina = 10;
    $scope.qtde_paginas = 1;
    $scope.qtde_posts = 0;
    $scope.debug = false;
    $scope.carregando = true;

    $scope.mostrarLoading = function() {
        $scope.carregando = true;
    }

    $scope.esconderLoading = function() {
        $scope.carregando = false;
    }

    $scope.carregarComentarios = function() {
        $scope.mostrarLoading();
        $http({
            method: 'GET',
            url: 'http://jsonplaceholder.typicode.com/comments'
        }).then (function (response, status, headers, config) {
                $scope.lista_de_comentarios = response.data;
                organizarLista(0);
                $scope.pagina_atual = 1;
                calcularQtdeDePaginas();
                montarListaDePosts();
                $scope.esconderLoading();
        });
    }

    $scope.carregarComentarios();

    $scope.avancarPagina = function() {
        if ($scope.pagina_atual < $scope.qtde_paginas) {
            $scope.pagina_atual++;
            montarListaDePosts();
        }
    }

    $scope.recuarPagina = function() {
        if ($scope.pagina_atual > 1) {
            $scope.pagina_atual--;
            montarListaDePosts();
        }
    }

    $scope.exibirComentarios = function(comentario) {
        comentario.exibindo = !comentario.exibindo;
    }

    var calcularQtdeDePosts = function() {
        
        var id_post_anterior = -1;
        var qtdePosts = 0;
        for(var i = 0; i < $scope.lista_de_comentarios.length; i++) {
            var id_post_atual = $scope.lista_de_comentarios[i].postId;
            if (id_post_anterior != id_post_atual) {
                qtdePosts++;
                id_post_anterior = id_post_atual;
            }
        }
        $scope.qtde_posts = qtdePosts;
    }

    var organizarLista = function(filtro) {
        if (filtro > 0) {
            var lista = [];
            for(var i = 0; i<filtro; i++) {
                lista.push($scope.lista_de_comentarios[i]);
            }
            $scope.lista_de_comentarios = lista;
        }
    }
    
    var montarListaDePosts = function() {
        $scope.mostrarLoading();
        var lista_de_posts = [];
        var post_anterior = -1;
        var post_atual = {};
        var registro_inicial = (($scope.pagina_atual-1) * $scope.qtde_registros_por_pagina) + 1;
        var registro_final = registro_inicial + $scope.qtde_registros_por_pagina - 1;
        if (registro_final > $scope.qtde_posts) {
            registro_final = $scope.qtde_posts;
        }
        
        var qtde_posts_lidos = 0;
        var novo_registro = true;
    
        for(var i=0; i < $scope.lista_de_comentarios.length;i++) {
            if ($scope.lista_de_comentarios[i].postId != post_anterior) {
                post_anterior = $scope.lista_de_comentarios[i].postId;
                qtde_posts_lidos++;
                novo_registro = true;
            }

            if ((qtde_posts_lidos >= registro_inicial) && (qtde_posts_lidos <= registro_final) ) {
                var comentario_atual = $scope.lista_de_comentarios[i];
                if (novo_registro) {
                    post_atual = {};
                    post_atual.postId = comentario_atual.postId;
                    post_atual.exibindo = false;
                    post_atual.comentarios = [];
                    lista_de_posts.push(post_atual);
                    novo_registro = false;
                }
                post_atual.comentarios.push(comentario_atual);
            }

        }
        $scope.lista_para_exibicao = lista_de_posts;
        $scope.esconderLoading();
    }
    
    var calcularQtdeDePaginas = function() {
        calcularQtdeDePosts();
        var qtde_paginas = $scope.qtde_posts / $scope.qtde_registros_por_pagina;
        $scope.qtde_paginas = Math.ceil(qtde_paginas);
    }
});

