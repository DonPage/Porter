angular.module('porter')
.service("porterServ",function(){
        var data=[];
        var userData=[];
        var searchR = null;
        
        this.getItems = function(){
            var lsData = localStorage.getItem('firebase:session::porter');
            userData = JSON.parse(lsData) || userData;
            return userData;
            
        };
        
        
        this.getSearchResults = function () {
                return searchR;
        }
        
        this.pushResults = function (data) {
            
            searchR = data;
            
            //console.log("serv: ",searchR);

            
            
        }


});