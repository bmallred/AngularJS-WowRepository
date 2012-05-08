angular.module('WowArmory', ['ngResource']);

window.WowArmory = {};
window.WowArmory.counter = 0;

// This was done because I don't think I can use "callback: 'JSON_CALLBACK'" and
// I didn't want to hand-jam it everytime.
window.WowArmory.NewCallback = function(id) {
    if (id == undefined) {
        id = window.WowArmory.counter++;
    }

    return 'angular.callbacks._' + id;
};

window.WowArmory.ArmoryController = function($scope, $resource) {
    // Some bindable values.
    $scope.realm = { name: '', slug: '' };
    $scope.guild = '';

    // Handle the realms and its resource(s).
    $scope.realmError = '';
    $scope.realms = [];
    $scope.fetchRealms = function(roundTrip) {
        if (roundTrip == undefined) {
            roundTrip = 0;
        }
        
        $scope.apiRealms = $resource('//:server/api/wow/realm/status',
            { server: 'us.battle.net', jsonp: window.WowArmory.NewCallback() },
            { get: { method: 'JSONP' }});

        $scope.realms = $scope.apiRealms.get(
            {},
            function () {
                $scope.realmError = '';    
            },
            function () {
                if (console) {
                    console.log('Error retrieving guilds from the remote server.');
                }
                
                if (++roundTrip < 3) {
                    $scope.realmError = 'Attempting to fetch realms [attempt ' + roundTrip + ' of 3].';
                    setTimeout(function() { $scope.fetchRealms(roundTrip); }, 3000);
                }
                else {
                    $scope.realmError = 'Exhausted all resources, battle.net sucks.';
                }
            });
    };
    $scope.fetchRealms(0);

    // Handle the members and its resource(s).
    $scope.memberError = '';
    $scope.members = [];
    $scope.fetchMembers = function(roundTrip) {
        if (roundTrip == undefined) {
            roundTrip = 0;
        }

        if ($scope.realm.slug.length > 0 && $scope.guild.length > 0) {

            // Resource for the guild members.
            $scope.apiMembers = $resource('//:server/api/wow/guild/:realm/:guild', 
                { server: 'us.battle.net', realm: $scope.realm.slug, guild: $scope.guild, fields: 'members', jsonp: window.WowArmory.NewCallback() }, 
                { get: { method: 'JSONP' }});

            $scope.members = $scope.apiMembers.get(
                {}, 
                function() {
                    $scope.memberError = '';    
                }, 
                function() {
                    if (console) {
                        console.log('Error retrieving information from remote server.');
                    }
                    
                    if (++roundTrip < 3) {
                        $scope.memberError = 'Attempting to fetch members [attempt ' + roundTrip + ' of 3].';
                        setTimeout(function() { $scope.fetchMembers(roundTrip); }, 3000);
                    }
                    else {
                        $scope.memberError = 'Could not find the guild or any members.';
                    }
                    
                });
        }
    };
};
