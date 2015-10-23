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
 
  var apiKey     = false;
  var map        = null;
  var zoomMinimo = 15;

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
 
        //Load the markers
        loadMarkers();

      });

    }, function(error){
      console.log("Could not get location");
 
        //Load the markers
        loadMarkers();
    });
 
  }
 
  function loadMarkers(){
      //Get all of the markers from our Markers factory
      Markers.getMarkers().then(function(response){

        var markers      = [];
        var latlngbounds = new google.maps.LatLngBounds();
        var mkOptions    = {gridSize: 50, maxZoom: 16};
        var iconBase     = 'img/';

        var  icons = {
          Esporte:  { icon: iconBase + 'Esporte.png'},
          Noite:    { icon: iconBase + 'Noite.png'},
          Estudo:   { icon: iconBase + 'Estudo.png'},
          Jogo:     { icon: iconBase + 'Jogo.png'},
          Trabalho: { icon: iconBase + 'Trabalho.png'},
          Relax:    { icon: iconBase + 'Relax.png'}
        };

        var records  = response.data;

        for (var i = 0; i < records.length; i++) {
 
          var record = records[i];   

          var markerPos = new google.maps.LatLng(record.latitude, record.longitude);

          // Add the markerto the map
          var marker = new google.maps.Marker({
              map: map,
              animation: google.maps.Animation.DROP,
              position: markerPos,
              icon: icons[record.tipo].icon
          });   
          
          var infoWindowContent = "<h4>" + record.nome + "</h4> <BR/> <h5>"+ record.descricao +"</h5>" ;          
 
          addInfoWindow(marker, infoWindowContent, record);

          markers.push(marker);

          latlngbounds.extend(marker.position);
        }

        var markerCluster = new MarkerClusterer(map, markers, mkOptions); 
        //Zoom automatico para colcoar todos os markers na tela.
        map.fitBounds(latlngbounds);
      }); 
  }
 
  function addInfoWindow(marker, message, record) {
 
      var infoWindow = new google.maps.InfoWindow({
          content: message
      });
 
      google.maps.event.addListener(marker, 'click', function () {

          var zoom = Math.max(zoomMinimo, map.getZoom());
          
          console.log("zoomMinimo : " + zoomMinimo);
          console.log("map.getZoom() : " + map.getZoom());

          map.setZoom(zoom);
          map.setCenter(marker.getPosition());
          infoWindow.open(map, marker);

      });
 
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