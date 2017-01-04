this["JST"] = this["JST"] || {};

this["JST"]["assets/templates/about.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<main-content>\n\t<div class="container md-padding">\n\t\t<h1>About Us</h1>\n\t\t<div ng-repeat="content in mc.fillerContent"><p>{{ content }}</p><br/></div>\n\t</div>\n</main-content>\n';

}
return __p
};

this["JST"]["assets/templates/appbuttons.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div class="main">\n   <div class="container">\n      <div class="container">\n         <h2>Available for iPhone and Android.</h2>\n         <a href="/iosapp"><img src="https://s3.amazonaws.com/codecademy-content/projects/shutterbugg/app-store.png" width="120px" /></a>\n         <a href="/androidapp"><img src="https://s3.amazonaws.com/codecademy-content/projects/shutterbugg/google-play.png" width="110px" /></a>\n      </div>\n   </div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/education.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<main-content>\n\t<div class="container md-padding">\n\t\t<h2>Education</h2>\t\n\t</div>\n</main-content>\n';

}
return __p
};

this["JST"]["assets/templates/header.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '';

}
return __p
};

this["JST"]["assets/templates/homepage.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<h2>Teaching LEAN</h2>\n';

}
return __p
};

this["JST"]["assets/templates/login.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-content ng-controller="AuthController as vm">\n\t<div class="container md-padding">\n\t\t<md-card class="login-form">\n\t\t\t<md-card-title>\n\t\t\t\t<md-card-title-text>\n\t\t\t\t\t<span class="md-headline md-primary">Sign in</span>\n\t\t\t\t\t<span class="md-subhead text-warn">{{vm.loginError}}</span>\n\t\t\t\t</md-card-title-text>\n\t\t\t</md-card-title>\n\t\t\t<md-card-content layout="row" layout-sm="column" layout-align="space-around" ng-if="vm.didClickLogin">\n\t\t\t\t<md-progress-circular md-mode="indeterminate"></md-progress-circular>\n\t\t\t</md-card-content>\n\t\t\t<md-card-content>\n\t\t\t\t<div layout="column">\n\t\t\t\t\t<md-input-container>\n\t\t\t\t\t\t<label>Username</label>\n\t\t\t\t\t\t<input required ng-model="username" type="email">\n\t\t\t\t\t</md-input-container>\n\t\t\t\t\t<md-input-container>\n\t\t\t\t\t\t<label>Password</label>\n\t\t\t\t\t\t<input required ng-model="password" type="password">\n\t\t\t\t\t</md-input-container>\n\t\t\t\t</div>\n\t\t\t</md-card-content>\n\t\t\t<md-card-content layout="column">\n\t\t\t\t<md-button class="md-raised md-primary" ng-click="vm.authenticateLocal(username, password)">Sign in</md-button>\n\t\t\t\t<md-button class="md-raised md-primary" ng-click="vm.authenticateLinkedIn()">Login through LinkedIn</md-button>\n\t\t\t</md-card-content>\n\t\t\t<md-card-content layout="column">\n\t\t\t\t<md-button class="md-raised md-primary" ng-click="vm.authenticateLocal(username, password)">Forgot Password?</md-button>\n\t\t\t\t<md-button class="md-raised md-primary" ng-href="/createAccount">Create Account</md-button>\n\t\t\t</md-card-content>\n\t\t</md-card>\n\t</div>\n</md-content>\n';

}
return __p
};

this["JST"]["assets/templates/teachingResources.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<main-content>\n\t<div class="container md-padding">\n\t\t<h2>Teaching Resources</h2>\n\t</div>\n</main-content>\n';

}
return __p
};

this["JST"]["assets/templates/user/admin.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<main-content ng-controller="DashboardController as vm">\n\t<div class="container md-padding">\n\t\t<h2>Admin Control Panel</h2>\n\t</div>\n</main-content>\n';

}
return __p
};

this["JST"]["assets/templates/user/createAccount.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<main-content ng-controller="AuthController as vm">\n\t<div class="container md-padding">\n\t\t<h3>Create Account</h3>\n\t</div>\n</main-content>\n';

}
return __p
};

this["JST"]["assets/templates/user/dashboard.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-content ng-controller="DashboardController as vm" layout-fill>\n  <div layout="column" class="container">\n    <ng-include src="vm.templatePath" layout-padding></ng-include>\n  </div>\n  <div ng-hide="mc.user" class="container">\n    <div flex class="md-padding">\n      <div class="md-padding" layout="column" layout-align="center center">\n        <h3 flex>You are not logged in.</h3>\n        <div flex>\n          <md-button class="md-raised md-accent" ng-href="/login">Login here</md-button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div ng-show="mc.user" layout-fill>\n    <md-tabs md-border-bottom md-autoselect>\n      <md-tab label="Recent Activity">\n        <div layout-padding>\n\t\t  <span>Recent Activity goes here...</span>\n        </div>\n      </md-tab>\n\t  <md-tab label="Questions">\n        <div layout-padding>\n\t\t  <span>Questions goes here...</span>\n        </div>\n      </md-tab>\n\t  <md-tab label="Answers">\n        <div layout-padding>\n\t\t  <span>Answers goes here...</span>\n        </div>\n      </md-tab>\n\t  <md-tab label="Comments">\n        <div layout-padding>\n\t\t  <span>Comments goes here...</span>\n        </div>\n      </md-tab>\n    </md-tabs>\n\t<profile user="mc.user"></profile>\n  </div>\n</md-content>\n';

}
return __p
};

this["JST"]["assets/templates/user/me.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '\n<div flex>\n\t<h2 ng-model="mc.user.firstname">{{mc.user.firstname}}\'s Dashboard</h2>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/user/profile.tmpl.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-card class="md-whiteframe-9dp float-middle-right">\n  <md-card-title>\n    <md-card-avatar>\n      <img class="md-user-avatar" ng-src="{{user.pictureUrl}}">\n    </md-card-avatar>\n    <span flex="5"><!-- Spacer --></span>\n    <md-card-title-text>\n      <span class="md-headline">{{user.name}}</span>\n      <span class="md-subhead">Reputation: {{user.reputation}}</span>\n    </md-card-title-text>\n  </md-card-title>\n  <md-card-actions layout="" layout-align="start|center|end|space-around|space-between start|center|end|stretch">\n    <md-card-icon-actions>\n        <md-button ng-show="!vm.isEditing" ng-click="vm.isEditing = true">Edit</md-button>\n        <md-button ng-show="vm.isEditing" ng-click="vm.isEditing = false">Save</md-button>\n    </md-card-icon-actions>\n  </md-card-actions>\n  <md-card-content>\n      {{user.bio}}\n  </md-card-content>\n</md-card>';

}
return __p
};

this["JST"]["assets/templates/user/settings.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<main-content ng-controller="SettingsController as vm">\n\t<div class="container md-padding">\n\t\t<h2>Settings</h2>\n\t\t<div layout="column">\n\t\t\t<md-input-container class="md-block">\n\t\t\t\t<label>First name</label>\n\t\t\t\t<input ng-model="vm.edits.firstname"  ng-change="vm.didMakeEdit()">\n\t\t\t</md-input-container>\n\t\t\t<md-input-container class="md-block">\n\t\t\t\t<label>Last name</label>\n\t\t\t\t<input ng-model="vm.edits.lastname" ng-change="vm.didMakeEdit()">\n\t\t\t</md-input-container>\n\t\t\t<md-input-container class="md-block">\n\t\t\t\t<label>Email</label>\n\t\t\t\t<input ng-model="vm.edits.email" ng-change="vm.didMakeEdit()">\n\t\t\t</md-input-container>\n\t\t\t<md-button class="md-button md-raised md-accent" ng-click="vm.updateUser()" ng-disabled="!vm.enableSaveButton">Save</md-button>\n\t\t</div>\n\t</div>\n</main-content>\n';

}
return __p
};