angular.module('porter', ['ngRoute', 'firebase', 'youtube-embed'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "views/home.html",
                controller: "homeController"
            })
            .when("/room", {
                controller: "roomController",
                templateUrl: "views/room.html"
            })
            .when("/about",{
                controller: "aboutController",
                templateUrl: "views/about.html"
            })
            .when("/register",{
                controller: "registerController",
                templateUrl: "views/register.html"
            })
            .when("/login",{
                controller: "loginController",
                templateUrl: "views/login.html"
            })
            .otherwise({
                redirectTo: "/"
            });
    })
.controller("loginController", function($scope, $firebase){
    
    $scope.registerUser = function(){   

        //Ref Firebase var to call in facebook api
        ref.authWithOAuthPopup("google", function(error, authData){
              
                var userRef = ref.child("/users/");
                $scope.id = authData.google.id;
                
                userRef.child($scope.id).update({
                  //Information grabbing from Google
                  name: authData.google.displayName,
                  email: authData.google.email
              });
             var redirect = '#/';
             window.location.hash = redirect;
            }
            ,{ 
              scope: "email",
              remember: "default"
            } 
        );

         }; //Google Auth Closing Tag 
         
        //Register COntroller bracket
    
})
    
.controller("homeController", function($scope, $firebase){
    console.log("home Controller");
})

.controller("roomController", function($scope, $firebase, $http){
    console.log("room controller");
   
   $scope.options = [
    { label: 'YouTube', value: 1 },
    { label: 'Sound Cloud', value: 2 }
  ];
    
    //if the current client is the creator of the room.
    $scope.isOwner = false;
    
    //device name, all devices must have a name before doing anything OR select an existing device.
    $scope.deviceName = false;
    
    //the search results from the different api's.
    $scope.searchArray = [];
    
    //current selected playlist
    $scope.currentPlaylist = "default";
    
    //this is what the user is currently searching, youtube is the default.
    $scope.serviceSearching = "youtube";
    
    //just a string to hold the current video.
    $scope.currentSong = "";
    
    
    
    //this is what the user is currently searching, option 1 is default.
     $scope.correctlySelected = $scope.options[1];
    
    //right now this only for youtube search.
    $scope.searchingVideo = function (q) {
        // console.log($scope.correctlySelected.label);
        
        if($scope.correctlySelected.label === "YouTube"){
            console.log("youtube search");
             $http.get("https://www.googleapis.com/youtube/v3/search" +
                "?part=snippet" +
                "&q="+ q +"" +
                "&maxResults=50"+
                "&key=AIzaSyAvy2vZGTkZ5b8yyZ0o7VWEfWaLM6HCxts")
                .success(function(data){
                    $scope.searchArray = data.items;
                    console.log("RESULTS array" ,$scope.searchArray);


                })
                .error(function(data){
                    console.log("YT ERROR:", data);
                });
                
        }
        
        else if($scope.correctlySelected.label === "Sound Cloud"){
            console.log("soundcloud search");
            
             $http.get("https://api.soundcloud.com/tracks.json?client_id=32393a2885421a0854a43640691c3eba&q="+q+"&limit=50")
                .success(function(data){
                    
                    // $scope.searchArray = data.items;
                    console.log("RESULTS array" ,data);


                })
                .error(function(data){
                    console.log("YT ERROR:", data);
                });
            
        }
            
        
        
        
        
        console.log("searching video", q);
        
       
            
    };
    
    
    
    
    
    
})

.controller('aboutController',function($scope){
    
    console.log("This is the home controller");

})

.controller("registerController", function($scope, $firebase){
    
    //Calling the awesomse Firebase! Hello Firebase, come in!
    var ref = new Firebase("https://porter.firebaseio.com/");

    if(localStorage.getItem('firebase:session::porter')){
        window.location.hash = "#/";
            }else{
            
            $scope.registerUser = function(){   
    
            //Ref Firebase var to call in facebook api
            ref.authWithOAuthPopup("google", function(error, authData){
                  
                    var userRef = ref.child("/users/");
                    $scope.id = authData.google.id;
                    
                    userRef.child($scope.id).update({
                      //Information grabbing from Google
                      name: authData.google.displayName,
                      email: authData.google.email
                  });
                 var redirect = '#/';
                 window.location.hash = redirect;
                }
                ,{ 
                  scope: "email",
                  remember: "default"
                } 
            );

         }; //Google Auth Closing Tag 
         
        }
        
       } //Register COntroller bracket
       
    ) // close controller "register controller"
 
  /* End Register Controller */

.controller('form',function($scope){
    
    

})

.directive('player', function(){
   return{
       scope:{},
       restrict:'E',
       controller: function($scope){
         
    
       },
       link:function(scope, element, attrs){
           
    
    var wordArray = ["Music",'Live','Youtube','SoundCloud','HELLO?'];
           
           var i = 0, l = wordArray.length;
            (function iterator() {
                scope.word = wordArray[i];  
                 $(".newWord").html( wordArray[i]);
                if(++i<l) {
                setTimeout(iterator, 1750);
                }
            })();

           
       } // function closing tag
   }; // return closing tag
   
    
}); //cta closing tags