(function(){
    'use strict';

    angular
        .module('authApp')
        .controller('profileController', profileController);

    function profileController($http, store){
        var vm = this;
      //  vm.message = 'Hellooooo';
        vm.getMessage = getMessage; // for public msg
        vm.getSecretMessage = getSecretMessage; // for private msg
        vm.message; // to assign data that comes back from response(endpoint)

        vm.profile = store.get('profile'); // gives access to user properties-name,photo,nickname

        // function to get public message
        function getMessage(){
            $http.get('http://localhost:3001/api/public', {
                skipAuthorization: true // coz we dont need authentication for public
            }).then(function(response){
                vm.message = response.data.message;
            });
        }

        function getSecretMessage(){
            $http.get('http://localhost:3001/api/private')
                .then(function(response){
                     vm.message = response.data.message;
                });
        }
    }

})();