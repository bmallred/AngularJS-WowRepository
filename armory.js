angular.module('WowArmory', ['ngResource']);

function ArmoryController($scope, $resource) {
    $scope.armory = $resource('http://us.battle.net/api/wow/guild/hellscream/:action', 
        { action: 'alkaline', fields: 'members', jsonp: 'angular.callbacks._0' }, 
        { query: { method: 'JSONP' }});

    $scope.Guild = $scope.armory.get();
};
