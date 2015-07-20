# Angular Intercom
Intercom wrapper for Angular

## Usage

### Reference script
```html
<script src="ng-intercom.min.js"></script>
```

### Inject `vtex.intercom`
```coffeescript
angular.module 'yourApp', ['vtex.intercom']
```

### Fill intercomConfig
This object should contain at least your Intercom application credentials (`app_id`) and main user data, such as name, email, age, etc.

```coffeescript
.config (intercomConfig) ->
    intercomConfig.app_id = 'bs8us8hw'
    intercomConfig.user = window.vtex.topbar.utils.user # `Object`

    # e.g.: Custom widget/button that pops Intercom conversation modal:
    # intercomConfig.widget =
    #	activator: '#vtex-intercom-widget'
    # See Intercom docs for more
```

##### Send all user data you want by extending `intercomUserData` as well
This is mainly for extra user data, such as environment of access and all other info your `user` object lacks. Feel free to send whatever back to your Intercom.

```coffeescript
.value 'intercomUserData',
    'Store': vtex.topbar.utils.config.store
    'Environment': vtex.topbar.topbar.environment.match(/beta|stable/)[0] ? 'stable'
```

### Directive and binding
Defaults and shortcuts:
- `intercom-event`: Event name, be creative. ( `String` )
- `intercom-on`: "click" ( *this is what fires events to Intercom*, e.g.: "hover", "mouseleave" )
- `intercom-metadata`: Whatever extra info to send along

Example:
```html
<button id="sign-up" class="btn btn-primary" value="Sign Up"
				intercom-event="Sign The Duck Up"></button>
```

### Development
Inside `src` you can find this module source code, written in **CoffeeScript**. To build the `.js` and uglify it, install npm dev-dependencies and run grunt:

    (sudo) npm i
    grunt

**Don't forget to build after updating the version and before committing any changes, since it's version appears in minified files.**
