(function(){
    'use strict';

    angular
        .module('authApp')
        .directive('toolbar', toolbar);

    function toolbar(){
        return{
            templateUrl: 'components/toolbar/toolbar.tpl.html',
            controller: toolbarController,
            controllerAs: 'toolbar'
        }
    }

    // to log user in and out
// auth service is for opening the lock widget and make the request for logging in 
    function toolbarController(auth, store, $location){
       var vm = this;   // capture variable
       vm.login = login;
       vm.logout = logout;
       vm.auth = auth;

       function login(){
           // profile comes from auth0, it is a json obj that has users profile details,
           // token is the jwt that returns when the user signs in 
           auth.signin({}, function(profile, token){
               store.set('profile', profile); // setting them on localstorage
               store.set('id_token', token);
               // if this is success user redirectedto homepage
               $location.path('/home');
           }, function(error){
               console.log(error);
           });
       }

       //removing jwt from local storage 
       // even after removing that token can be used to access backend as long as token lives
       function logout(){
            store.remove('profile');
            store.remove('id_token');
            auth.signout();
            $location.path('/home');
       }

    }


})(); // executing the immediately invoked function expression