angular.module('porter', ['ngRoute', 'firebase', 'youtube-embed', 'plangular'])
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
                redirectTo: "#/"
            });
    })
    

  

.controller("homeController", function($scope, $firebase, porterServ){
    
    var ref = new Firebase("https://porter.firebaseio.com/");
    
    $scope.logOut = function(){
        ref.unauth();
        window.location.hash = '/#';
    }

    //Calling the awesomse Firebase! Hello Firebase, come in!
    var ref = new Firebase("https://porter.firebaseio.com/");
    //console.log(porterServ.getItems());
    if(localStorage.getItem('firebase:session::porter')){
        
        window.location.hash = '/#';
        $("#glgin").hide();

            
        
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
                 var redirect = '/#';
                 window.location.hash = redirect;
                $("#glgin").hide();
                }
                ,{ 
                  scope: "email",
                  remember: "default"
                });
         }; //Google Auth Closing Tag 
         }}) // close controller "register controller"
 
  /* End Register Controller */

.controller("loginController", function($scope, $firebase, porterServ){
    
    
        //Calling the awesomse Firebase! Hello Firebase, come in!
    var ref = new Firebase("https://porter.firebaseio.com/");
    
    //$scope.logOut = function(){ref.unauth();}
    
    //console.log(porterServ.getItems());
    if(localStorage.getItem('firebase:session::porter')){
        
        window.location.hash = '#/';

            
        
    }else{
            
            $scope.loginUser = function(){   
    
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
    
    
})

.controller("roomController", function($scope, $firebase, $http, porterServ){
    //Dev room/user data
    
    
    
    //on init this will get user data, if any:
    function loadLSData() {
        $scope.stringLoginData = localStorage.getItem("firebase:session::porter");
        
        //parses data from ls, or just sets it to false if none given.
        $scope.loginData = JSON.parse($scope.stringLoginData) || false;
        
        console.log($scope.loginData);
        
        if(!$scope.loginData){
            //this will handle guest accounts.
            console.log("NOT LOGGED IN!");
        } else {
            console.log("USER IS LOGGED IN.");
            $scope.deviceID  = $scope.minDeviceID($scope.loginData.token);
            $scope.userID = $scope.loginData.google.id;
            
            console.log("FINAL user info:"+$scope.deviceID, $scope.userID);
            
        };
        
    }//END OF LOADLSDATA();
    
    //this mins the device ID so its more readable.
    $scope.minDeviceID = function (id) {
        //returns last 3 characters
        var lastThree = id.substr(id.length - 3);
        
        //just standard template text.
        var template = "Device"
        
        return template +"-"+lastThree;
    };
    
    loadLSData();//might move this later.
    
    //if user is not logged in this switches to dev, this will be changed later once guest accounts are put in.
    var userAccount = $scope.userID || "dev";
    
    console.log("userAccount:", userAccount);
    
    var userData = new Firebase("https://porter.firebaseio.com/users/" + userAccount + "/");
    
    // var userDevice = new Firebase("https://porter.firebaseio.com/users/" + userAccount + "/devices/");
    
    var sync = $firebase(userData);
    
    var syncDev = $firebase(userData.child("devices"));
    
    var recordDev = syncDev.$asObject();
    
    var record = sync.$asObject();
    
    record.$bindTo($scope, 'room');
    
    recordDev.$bindTo($scope, 'devices')
    
    var dev2 = $scope.deviceID;
    console.log("dev2", recordDev);
    
    syncDev.$update(dev2, {
        name: dev2
    });
    
    
    
    
    
    
    
    
    
    
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
        $scope.room.currentPlayer = "youtube";
        console.log("PLAY YOUTUBE!", link);
        $scope.room.currentlyPlaying = link;
         
        
    };
    
    /*
    $scope.removeItem = function(itemIndex){
        items.splice(itemIndex,1);
    }
    */
    
    $scope.playSoundcloud = function(link) {
        $scope.room.currentPlayer = "soundcloud";
        console.log("PLAY SC:", link);
        $scope.room.currentlyPlaying = link;

        
        function playSCSong(url) {
            SC.initialize({
                client_id: '4b634ae74afe3d56fbc6232340602934'
            });
            SC.stream(link, function(sound){
                sound.play();
            });
        };
        playSCSong(link);
    };

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




   