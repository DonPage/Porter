angular.module('porter', ['ngRoute', 'firebase'])
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
.controller("welcomeController", function($scope, $firebase){
    console.log("Congrats, you logged in BRUH!");
    
})
    
.controller("homeController", function($scope, $firebase){
    console.log("home Controller");
})

.controller("roomController", function($scope, $firebase, $http){
    console.log("room controller");
    
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
    
    $scope.searchingVideo = function (q) {
        console.log("searching video", q);
        
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
        
    };
    
    
    
    
    
    
})

.controller('aboutController',function($scope){
    
    console.log("This is the home controller");

})

.controller("registerController", function($scope, $firebase){
    
    //Calling the awesomse Firebase! Hello Firebase, come in!
    var ref = new Firebase("https://porter.firebaseio.com/");

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
             var redirect = '/login';
             window.location.hash = redirect;
            },{ 
              scope: "email",
              remember: "default"
            });
            
         }; //Google Auth Closing Tag 
         
       } //Register COntroller bracket
       
    ) // close controller "register controller"
 
  /* End Register Controller */

.controller('form',function($scope){
    
    

})