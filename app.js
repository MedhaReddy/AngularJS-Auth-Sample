'use strict';
angular.module('authApp', ['auth0', 'angular-storage', 'angular-jwt', 'ngMaterial', 'ui.router'])
       .config(function($provide, authProvider, $urlRouterProvider, $stateProvider, $httpProvider, 
                        jwtInterceptorProvider, jwtOptionsProvider){

        // initialize authProvider and pass an obj that configures it

        authProvider.init({
            domain: 'angularjs-jwt.auth0.com',
            clientID: 'ZQE8w9pVHDaYpB5bUlgGtWWr7T5ZxtFX' 
        });

        // for intercepting the token header automatically with every request
        jwtInterceptorProvider.tokenGetter = function(store){
            // get jwt from local storage and give it to jwtInterceptorProvider to attach as an 
            // authorization header for every request
            return store.get('id_token');
        }

        $urlRouterProvider.otherwise('/home');
        
        $stateProvider
            .state('home',{
               url: '/home',
               templateUrl: 'components/home/home.tpl.html'
            })
            .state('profile',{
                url: '/profile',
                templateUrl: 'components/profile/profile.tpl.html',
                controller: 'profileController as user'
            });

         function redirect($q, $injector, store, $location){
                
               console.log('inside redirect');
                return{
                    responseError: function(rejection){
                        
                        //if they have a rejection
                        if(rejection.status === 401){
                            var auth = $injector.get('auth');
                            auth.signout(); //authentication status is now false in auth service
                            store.remove('profile'); // removing itemsin localstorage
                            store.remove('id_token');
                            $location.path('/home'); // sending user back to home router
                        }
                        // this func ha to return something so return rejection from $q
                        return $q.reject(rejection);
                    }
                }
            }

       $provide.factory('redirect', redirect);
            // push this factory onto array of httpInterceptor
        $httpProvider.interceptors.push('redirect');   
        // push the interceptors into an array that has all interceptors coming from angular
        $httpProvider.interceptors.push('jwtInterceptor');

       // inorder to see the private msg we whitelisted the domain
        jwtOptionsProvider.config({
            // tokenGetter: ['authSvc', function(authSvc){
            //     return authSvc.getToken();
            // }],
            // unauthenticatedRedirectPath: '/',
            whiteListedDomains: ['localhost']
        });
})
// thing that has to happen after app is running
.run(function($rootScope, auth, store, jwtHelper, $location){
    
    $rootScope.$on('$locationChangeStart', function(){  // checking if there is change in location
        var token = store.get('id_token');     // placing id_token in token  
        if(token){                              // if token is present
            if(!jwtHelper.isTokenExpired(token)){  // if token is not expired 
                if(!auth.isAuthenticated){          // if token is not authenticated
                    auth.authenticate(store.get('profile'), token);    // authenticate it
                }
            }
        } else
        $location.path('/home');
    })
});


