angular.module('vtex.ngIntercom', [])

.constant 'intercomConfig',
  app_id: null
  user: {}

.value('intercomUserData', {})


.factory 'IntercomUser', ->
  class IntercomUser
    constructor: (data = {}) ->
      @name = data.name
      @email = data.email


.service 'IntercomService', ($window, intercomConfig, intercomUserData, IntercomUser) ->
  new class IntercomService
    constructor: ->
      @app_id = intercomConfig.app_id
      @user = new IntercomUser intercomConfig.user

      @settings = angular.extend {}, (_.pick intercomConfig, 'app_id'), intercomUserData
      $window.intercomUserData = @settings

      return if not $window.Intercom

      @boot()

    boot: => $window.Intercom 'boot', angular.extend {}, @user, @settings

    update: => $window.Intercom 'update', angular.extend {}, @user, @settings

    updateUser: (data) =>
      @user = new IntercomUser data
      @update()

    trigger: (eventName, metadata = {}) =>
      $window.Intercom 'trackEvent', eventName, metadata
      @update()


.directive 'intercomEvent', (IntercomService) ->
  restrict: 'A'
  link: (scope, elem, attrs) ->
    event = attrs.intercomEvent
    metadata = attrs.intercomMetadata ? {}
    trigger = attrs.intercomOn ? 'click'

    return if not event

    angular.element(elem).bind trigger, -> IntercomService.trigger event, metadata


.run ($rootScope, IntercomService) ->
  $rootScope.$on '$stateChangeSuccess', IntercomService.update
