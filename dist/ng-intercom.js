(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  angular.module('vtex.ngIntercom', []).constant('intercomConfig', {
    app_id: null,
    user: {}
  }).value('intercomSettings', {}).factory('IntercomUser', function() {
    var IntercomUser;
    return IntercomUser = (function() {
      function IntercomUser(data) {
        if (data == null) {
          data = {};
        }
        this.name = data.name;
        this.email = data.email;
      }

      return IntercomUser;

    })();
  }).service('IntercomService', function($window, intercomConfig, intercomSettings, IntercomUser) {
    var IntercomService;
    return new (IntercomService = (function() {
      function IntercomService() {
        this.trigger = bind(this.trigger, this);
        this.updateUser = bind(this.updateUser, this);
        this.update = bind(this.update, this);
        this.boot = bind(this.boot, this);
        this.app_id = intercomConfig.app_id;
        this.user = new IntercomUser(intercomConfig.user);
        this.settings = angular.extend({}, _.pick(intercomConfig, 'app_id'), intercomSettings);
        $window.IntercomSettings = this.settings;
        if (!$window.Intercom) {
          return;
        }
        this.boot();
      }

      IntercomService.prototype.boot = function() {
        return $window.Intercom('boot', angular.extend({}, this.user, this.settings));
      };

      IntercomService.prototype.update = function() {
        return $window.Intercom('update', angular.extend({}, this.user, this.settings));
      };

      IntercomService.prototype.updateUser = function(data) {
        this.user = new IntercomUser(data);
        return this.update();
      };

      IntercomService.prototype.trigger = function(eventName, metadata) {
        if (metadata == null) {
          metadata = {};
        }
        $window.Intercom('trackEvent', eventName, metadata);
        return this.update();
      };

      return IntercomService;

    })());
  }).directive('intercomEvent', function(IntercomService) {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var event, metadata, ref, ref1, trigger;
        event = attrs.intercomEvent;
        metadata = (ref = attrs.intercomMetadata) != null ? ref : {};
        trigger = (ref1 = attrs.intercomOn) != null ? ref1 : 'click';
        if (!event) {
          return;
        }
        return angular.element(elem).bind(trigger, function() {
          return IntercomService.trigger(event, metadata);
        });
      }
    };
  }).run(function($rootScope, IntercomService) {
    return $rootScope.$on('$stateChangeSuccess', IntercomService.update);
  });

}).call(this);
