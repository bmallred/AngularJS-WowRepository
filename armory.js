angular.module('WowArmory', ['ngResource']);

function ArmoryController($scope, $resource) {
    $scope.armory = $resource('//:server/api/wow/guild/:realm/:guild', 
        { server: 'us.battle.net', realm: 'alkaline', guild: 'alkaline', fields: 'members', jsonp: 'angular.callbacks._0' }, 
        { query: { method: 'JSONP' }});

    $scope.Guild = $scope.armory.get();
};
