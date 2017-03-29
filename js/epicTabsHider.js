
angular.module('epicTabsHider',[])
.directive('hideTabsBar',function($ionicTabsDelegate){
  return {
    restrict: 'A',
    link: function($scope, $elem, $attr){
      $scope.$on('$ionicView.beforeEnter',function(){
        $ionicTabsDelegate.showBar(false);
      });
      $scope.$on('$ionicView.beforeLeave',function(){
        $ionicTabsDelegate.showBar(true);
      });
    }
  }
});