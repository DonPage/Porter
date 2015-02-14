angular.module('porter')
.service("porter",function(){
        var data=[];
        this.getItems = function(){
            var lsData = localStorage.getItem('firebase:session::porter');
            data = JSON.parse(lsData) || data;
            return data;
}