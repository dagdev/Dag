// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, GoogleMaps) {
  console.log('[IN] run()');
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  })
  GoogleMaps.init();
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  //console.log("tt");
  // Força o tabs no rodapé utilizando o Android
  $ionicConfigProvider.tabs.position('bottom')

  $stateProvider
  .state('map', {
    url: '/',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  })
  .state('tabs.chat', {
    url: '/chat',
    views: {
      'chat-tab': {
        templateUrl: "templates/chat.html"
      }
    }
  });

  $urlRouterProvider.otherwise("/");
 
})

.factory('Markers', function($http) {
 
  var markers = [];

  return {
    getMarkers: function(){

      console.log("Entrou Markers.getMarkers()");

       return $http.get("http://dagball.xyz/testes/bolhas.php").then(function(dados){

        markers = dados;
        
        return markers;
        
      });
    }
  }
})

.factory('GoogleMaps', function($cordovaGeolocation, Markers){
  
  var iconBase  = 'img/';
  var icons     = {
                    Posicao:  { icon: iconBase + 'Posicao.png'},
                    Esporte:  { icon: iconBase + 'Esporte.png'},
                    Noite:    { icon: iconBase + 'Noite.png'},
                    Estudo:   { icon: iconBase + 'Estudo.png'},
                    Jogo:     { icon: iconBase + 'Jogo.png'},
                    Trabalho: { icon: iconBase + 'Trabalho.png'},
                    Relax:    { icon: iconBase + 'Relax.png'},
                    Viagem:   { icon: iconBase + 'Viagem.png'},
                    Teatro:   { icon: iconBase + 'Teatro.png'},
                    Compra:   { icon: iconBase + 'Compra.png'},
                    Corrida:  { icon: iconBase + 'Corrida.png'},
                    Balada:   { icon: iconBase + 'Balada.png'}
                  };
  var map        = null;
  var posReal    = new google.maps.Marker();
  var apiKey     = false;
  var zoomMinimo = 16;

  function initMap(){
    console.log("[IN] initMap()")
    var options = {timeout: 10000, enableHighAccuracy: true};
 
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
      var mapOptions = {
        center: latLng,
        zoom: zoomMinimo,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
      };
      
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
     
      //Wait until the map is loaded
      google.maps.event.addListenerOnce(map, 'idle', function(){
        posReal.setMap(map);
        posReal.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        posReal.setIcon(icons['Posicao'].icon);
        //Load the markers
        loadMarkers();

      });

    }, function(error){
      console.log("Could not get location");
    });
 
  }
 
  function loadMarkers(){
      //Get all of the markers from our Markers factory
      Markers.getMarkers().then(function(response){

        var bolhas      = [];
        var latlngbounds = new google.maps.LatLngBounds();
        var mkOptions    = {gridSize: 50, maxZoom: zoomMinimo};

        var records  = response.data;

        for (var i = 0; i < records.length; i++) {
 
          var record = records[i];   

          var bolhaPos = new google.maps.LatLng(record.latitude, record.longitude);

          // Add the markerto the map
          var bolha = addBolha(bolhaPos, icons[record.tipo].icon);   
          
          var infoWindowContent = "<h4>" + record.nome + "</h4> <BR/> <h5>"+ record.descricao +"</h5>" ;          
 
          addInfoWindow(bolha, infoWindowContent, record);

          bolhas.push(bolha);

          latlngbounds.extend(bolha.position);
        }

        var markerCluster = new MarkerClusterer(map, bolhas, mkOptions); 
        //Zoom automatico para colcoar todos os markers na tela.
        map.fitBounds(latlngbounds);
        
      }); 
  }
  
  function addBolha(position, icon){
    var bolha = new google.maps.Marker({
                                          map: map,
                                          animation: google.maps.Animation.DROP,
                                          position: position,
                                          icon: icon
                                        });
    google.maps.event.addListener(map, 'click', function(){ console.log('Click'); })
    return bolha;
  }

  function addInfoWindow(marker, message, record) {
 
    var infoWindow = new google.maps.InfoWindow({
        content: message
    });

    google.maps.event.addListener(marker, 'click', function () {

      var zoom = Math.max(zoomMinimo, map.getZoom());

      map.setZoom(zoom);
      infoWindow.open(map, marker);

    });
  } 
 
  function atualzaPosicaoReal(){
    
    posReal.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    
  }

  return {
    init: function(){
      console.log("Chamou initMap");
      initMap();
    }
  }
 
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
  
});