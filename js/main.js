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
            .when("/profile",{
                controller: "profileController",
                templateUrl: "views/profile.html"
            })

            .otherwise({
                redirectTo: "/"
            });
    })
    

  

.controller("homeController", function($scope, $firebase, porterServ){
    
    

    //Calling the awesomse Firebase! Hello Firebase, come in!
    var ref = new Firebase("https://porter.firebaseio.com/");
    //console.log(porterServ.getItems());
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

.controller("profileController", function($scope, $firebase){
    console.log(localStorage.getItem("uid"));
    
    
})

.controller("roomController", function($scope, $firebase, $http, porterServ){
    //Dev room/user data
    
    //default user account for dev purposes.
    var userAccount = "dev";
    
    var userData = new Firebase("https://porter.firebaseio.com/users/" + userAccount + "/");
    
    var sync = $firebase(userData);
    
    var record = sync.$asObject();
    
    record.$bindTo($scope, 'room');
    
    // console.log("currentPlaylist", $scope.room.currentPlaylist);
    
    // record.$loaded().then(function(data){
    //         console.log("$VALUE:", data);
    //     });
    
    
    
    
    //disabled for dev use only.
    // sync.$update({
    //     email: "random",
    //     username: "random",
    //     currentPlaylist: "default",
    //     currentIndex: 0,
    //     currentlyPlaying: "HAIDqt2aUek",
    //     allPlaylist: {
    //         default: {
    //             link: "https://www.youtube.com/watch?v=HAIDqt2aUek",
    //             link: "https://www.youtube.com/watch?v=HAIDqt2aUek"
    //         }
    //     }
    // })
    
    //currentIndex holds the value of index in firebase arrray.
    $scope.currentPlaylistRef = $firebase(userData.child("currentIndex")).$asObject();
    $scope.currentPlaylistRef.$loaded().then(function(data){
        
            console.log("$scope.currentIndex:", data.$value);
            $scope.currentIndex = data.$value;
            
            //small orange chicking, large chicking lowmein. small chicking
            
        });
    
    console.log($scope.currentIdx);


   $scope.options = [
    { label: 'YouTube', value: 1 },
    { label: 'SoundCloud', value: 2 }
  ];
    
    //if the current client is the creator of the room.
    $scope.isOwner = false;
    
    //device name, all devices must have a name before doing anything OR select an existing device.
    $scope.deviceName = false;
    
    //current player tells the DOM what player should be showing.
    $scope.currentPlayer = "youtubeplayer";
    
    //the search results from the different api's. this is mainly for soundcloud
    $scope.searchArray = porterServ.getSearchResults();
    
    //youtube search results:
    $scope.youtubeSearchArray = [];
    
    //soundcloud search array:
    $scope.soundcloudSearchArray = [];
    
    //current selected playlist
    $scope.currentPlaylist = "default";
    
    //this is what the user is currently searching, youtube is the default.
    $scope.serviceSearching = "youtube";
    
    //just a string to hold the current video.
    $scope.currentSong = "";
    
    //player auto plays
    $scope.playerVar = {
            autoplay: 1 //auto play video = true;
    };
    
    
    
     $scope.$on('youtube.player.ended', function ($event, player) { //action once video ends.
     
        console.log("video has ended");
        
        //adds one to the current index.
        $scope.room.currentIndex ++;
        //holds the next index value.
            var nextIdx = $scope.room.currentIndex;
            
            var playlistData = new Firebase("https://porter.firebaseio.com/users/" + userAccount + "/allPlaylist/default/");
    
            var syncPlaylist = $firebase(playlistData);
    
            var recordPlaylist = syncPlaylist.$asObject();
            
            var arrayPlaylistSync = syncPlaylist.$asArray();
            
            var playlistShadow = [];
            
            recordPlaylist.$loaded().then(function (data) {
                console.log("data:", data['-JiADdHjIW-jUbpO3Fu_']);
                for (var keys in data) {
                    if (data.hasOwnProperty(keys)) {
                        
                        console.log(data[keys]);
                        
                        
                        var usersRef = new Firebase('https://porter.firebaseio.com/users/dev/allPlaylist/default/');
                        var fredRef = usersRef.child('4');
                        console.log(fredRef);

                        
                    }
            }
            })
            
            
            
            console.log("FOREVER: ", recordPlaylist);
            // console.log("ARRAY:", arrayPlaylistSync);
            
            

            

            // if( nextIdx == playlistLength){ //failsafe for if user is at the end of playlist

            //     console.log("end of playlist, starting over");
            //     console.log("NEXT:", $scope.syncPlaylistArray[0]);

            //     return $scope.newVideo(playlist[0].id, 0); //play video at the beginning of array
            // }

            // console.log("NEXT:", $scope.syncPlaylistArray[$scope.syncIndex + 1]);
            // $scope.newVideo(playlist[nextIdx].id, nextIdx);

        });
    
    
    
    //this is what the user is currently searching, option 1 is default.
     $scope.correctlySelected = $scope.options[1];
    
    //right now this only for youtube search.
    $scope.searchingVideo = function (q) {
        console.log("SEARCHING VIDEO");
        // console.log($scope.correctlySelected.label);
        
        if($scope.correctlySelected.label === "YouTube"){
            console.log("youtube search");
             $http.get("https://www.googleapis.com/youtube/v3/search" +
                "?part=snippet" +
                "&q="+ q +"" +
                "&maxResults=50"+
                "&key=AIzaSyAvy2vZGTkZ5b8yyZ0o7VWEfWaLM6HCxts")
                .success(function(data){
                    $scope.youtubeSearchArray = data.items;
                    porterServ.pushResults(data.items);
                    $scope.searchArray = porterServ.getSearchResults();


                })
                .error(function(data){
                    console.log("YT ERROR:", data);
                });
                
        }
        
        else if($scope.correctlySelected.label === "SoundCloud"){
            console.log("soundcloud search");
            
             $http.get("https://api.soundcloud.com/tracks.json?client_id=32393a2885421a0854a43640691c3eba&q="+q+"&limit=10")
                .success(function(data){
                    
                    // $scope.searchArray = data.items;
                    $scope.soundcloudSearchArray = data; //preseting the data, this will be removed later and replaced by the service.
                    porterServ.pushResults(data);
                    $scope.searchArray = porterServ.getSearchResults();
                })
                .error(function(data){
                    console.log("YT ERROR:", data);
                });
            
        }else if($scope.correctlySelected.label === "spotify"){
            console.log("soundcloud search");
            
             $http.get("https://api.soundcloud.com/tracks.json?client_id=32393a2885421a0854a43640691c3eba&q="+q+"&limit=10")
                .success(function(data){
                    
                    // $scope.searchArray = data.items;
                    $scope.soundcloudSearchArray = data; //preseting the data, this will be removed later and replaced by the service.
                    porterServ.pushResults(data);
                    $scope.searchArray = porterServ.getSearchResults();
                })
                .error(function(data){
                    console.log("YT ERROR:", data);
                });
            
        }
        console.log("searching video", q);
            
    };
    /* Section that adds the videos to the users playlist */
    $scope.addYTSong = function(song) {
        
        var userDB = new Firebase("https://porter.firebaseio.com/users/dev/allPlaylist/default/");
        //Pushes informaiton to firebase
        userDB.push({
            'link' : 'https://www.youtube.com/watch?v=' + song['id']['videoId'],
            'name' : song['snippet']['title'],
            'image_medium' : song['snippet']['thumbnails']['medium']['url'],
            'player' : 'youtube'
        });
        //console.log(song);
    }
    
    $scope.addSCSong = function(song) {

        var userDB = new Firebase("https://porter.firebaseio.com/users/dev/allPlaylist/default/");
        //Pushes informaiton to firebase
        userDB.push({
            'link' : song.stream_url,
            'name' : song.title,
            'image_medium' : song.artwork_url,
            'player' : 'soundcloud'
        }); 
        //console.log(song);        
    }
    
    
    $scope.playYoutube = function (link) {
        console.log("PLAY YOUTUBE!", link);
        $scope.room.currentlyPlaying = link;
        $scope.room.currentPlayer = "youtube";
        
    };
    
    $scope.playSoundcloud = function(link) {
        $scope.room.currentPlayer = "soundcloud";
        console.log("PLAY SC:", link);
    };

})

.controller('aboutController',function($scope){
    
    console.log("This is the home controller");

})



.directive('player', function(){
  return{
      scope:true,
      restrict:'E',
      controller: function($scope){
         
         
        $scope.addSound = function(index){
            console.log("HELLO CONTROLLER DIRECTIVE");
        SC.initialize({
          client_id: '4b634ae74afe3d56fbc6232340602934'
        });
        // stream track id 293
        SC.stream("https://api.soundcloud.com/tracks/138777816/stream", function(sound){
          sound.play();
        });
        }
      },
      link:function(scope, element, attrs){
           
    
    var wordArray = ["One line",'2 line','3 line','4 line','5 line'];
           
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
   
    
}) //cta closing tags

.directive('cta', function(){
   return{
       scope:{},
       restrict:'E',
       controller: function($scope){
         
    
       },
       link:function(scope, element, attrs){
           
    
    var wordArray = ["Music",'Life','Freeing','Are Melodies','Porter'];
           
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




   