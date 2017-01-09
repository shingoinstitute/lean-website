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

this["JST"]["assets/templates/entries/add.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-dialog flex>\n  <md-toolbar class="md-primary">\n    <span class="md-toolbar-tools">\n      <h2>Post {{parent ? \'Answer\' : \'Question\'}}</h2>\n    </span>\n  </md-toolbar>\n  <form name="addEntryForm" ng-cloak>\n    <md-input-container md-no-float class="md-title">\n      <input name="title" type="text" placeholder="Title" required ng-model="entry.title" />\n      <div ng-messages="addEntryForm.title">\n        <div ng-message="required">\n          Your Question needs a title!\n        </div>\n      </div>\n    </md-input-container>\n    <summernote   ng-model="entry.content" height="300"></summernote>\n    <md-button class="md-raised md-primary" ng-click="post()" ng-disabled="addEntryForm.$invalid">Post</md-button>\n  </form>\n</md-dialog>\n';

}
return __p
};

this["JST"]["assets/templates/entries/addComment.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-dialog flex>\n  <md-toolbar class="md-primary">\n    <span class="md-toolbar-tools">\n      <h2>Post Comment</h2>\n    </span>\n  </md-toolbar>\n  <form name="addCommentForm" ng-cloak>\n    <summernote   ng-model="comment.content" height="150"></summernote>\n    <md-button class="md-raised md-primary" ng-click="save()" ng-disabled="addCommentForm.$invalid">Comment</md-button>\n  </form>\n</md-dialog>';

}
return __p
};

this["JST"]["assets/templates/entries/answer.tmpl.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-card class="answer">\n  <form name="answerDetailForm" ng-cloak>\n    <md-card-content>\n      <div ng-show="!isEditing">\n        <div layout="row">\n          <div ng-show="entry.markedCorrect" class="correct">\n            &check;\n          </div>\n          <h2>{{entry.title}}</h2>\n        </div>\n        <hr>\n        <div flex ng-bind-html="entry.content" class="q-content trix-content"></div>\n      </div>\n      <div ng-show="isEditing">\n        <md-input-container md-no-float>\n          <input class="md-title" name="title" type="text" ng-model="entry.title" required aria-label="Title" flex>\n          <div ng-messages="answerDetailForm.title">\n            <div ng-message="required">\n              A title is required\n            </div>\n          </div>\n        </md-input-container>\n        <summernote   ng-model="entry.content" height="300"></summernote>\n      </div>\n    </md-card-content>\n    <span flex><!-- filler --></span>\n    <div layout="row">\n      <div class="up-down-votes" layout="column">\n        <md-button ng-click="upVote()" class="md-fab md-mini md-primary" style="font-size: 150%;">&#8593;</md-button>\n        <md-button class="md-fab md-mini" ng-disabled="true">{{entry.votes}}</md-button>\n        <md-button ng-click="downVote()" class="md-fab md-mini md-primary" style="font-size: 150%;">&#8595;</md-button>\n      </div>\n      <span flex><!-- filler --></span>\n      <div layout="column" layout-padding>\n        <span class="summary-small">Posted by {{entry.owner.name}} on {{entry.createdAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n        <span ng-show="entry.createdAt != entry.updatedAt" class="summary-small">Edited on {{entry.updatedAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n        <span flex><!-- filler --></span>\n        <md-card-actions>\n          <md-button ng-show="!isEditing" class="md-raised md-primary" ng-click="isEditing = true">Edit</md-button>\n          <md-button ng-show="isEditing" ng-disabled="answerDetailForm.$invalid || answerDetailForm.$pristine" ng-click="save()" class="md-raised md-primary">Save</md-button>\n          <md-button ng-show="isEditing" ng-click="isEditing = false" class="md-raised md-accent">Cancel</md-button>\n          <md-button ng-show="!isEditing" class="md-raised md-primary" ng-click="comment()">Comment</md-button>\n          <md-button ng-show="!isEditing && !entry.markedCorrect && !answered()" class="md-fab md-accent" ng-click="accepted()">&check;</md-button>\n        </md-card-actions>\n      </div>\n    </div>\n  </form>\n</md-card>\n<div class="comments-container">\n  <comment comm="comment" ng-repeat="comment in entry.comments"></comment>\n</div>';

}
return __p
};

this["JST"]["assets/templates/entries/comment.tmpl.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="comment" layout="column">\n  <p ng-show="!isEditing" ng-bind-html="comm.content" class="trix-content"></p>\n  <div ng-show="isEditing">\n    <summernote id="comm.id"   ng-model="comm.content" height="100"></summernote>\n  </div>\n  <span flex><!-- filler --></span>\n  <div layout="row">\n    <md-button ng-show="!isEditing" class="small-button md-primary" ng-click="isEditing=true">Edit</md-button>\n    <md-button ng-show="isEditing" class="small-button md-primary" ng-click="save()">Save</md-button>\n    <md-button ng-show="isEditing" class="small-button md-accent" ng-click="isEditing=false">Cancel</md-button>\n    <span flex><!-- filler --></span>\n    <div layout="column">\n      <span class="summary-small">Posted by {{comm.owner.name}} on {{comm.createdAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n      <span ng-show="_entry.createdAt != _entry.updatedAt" class="summary-small">Edited on {{comm.updatedAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n    </div>\n  </div>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/entries/detail.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-content ng-controller="EntryDetailController as vm">\n    <question ng-show="vm.question" entry="vm.question" owner="mc.user.uuid" flex></question>\n    <answer id="answer-{{answer.id}}" entry="answer" ng-repeat="answer in vm.question.answers"></answer>\n</md-content>\n';

}
return __p
};

this["JST"]["assets/templates/entries/home.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-content ng-controller="EntryHomeController as vm" layout-fill layout-padding>\n  <div layout="column">\n    <div layout="row">\n      <md-input-container md-no-float flex="70">\n        <input type="text" placeholder="Search..." ng-model="vm.search">\n      </md-input-container>\n      <div flex="20" layout-align="center center">\n        <md-button class="md-raised md-primary" ng-click="vm.postQuestion(mc.user.uuid)">\n          Post Question\n        </md-button>\n      </div>\n    </div>\n  </div>\n  <h2>Recent Questions</h2>\n  <hr>\n  <md-list-item ng-repeat="question in vm.recent | orderBy: \'createdAt\' : reverse">\n    <entry-summary entry="question" flex></entry-summary>\n  </md-list-item>\n</md-content>\n';

}
return __p
};

this["JST"]["assets/templates/entries/question.tmpl.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-card class="question">\n  <form name="questionDetailForm" ng-cloak>\n    <md-card-content>\n      <div ng-show="!isEditing">\n        <h2>{{entry.title}}</h2>\n        <hr>\n        <div flex ng-bind-html="entry.content" class="q-content trix-content"></div>\n      </div>\n      <div ng-show="isEditing">\n        <md-input-container md-no-float>\n          <input class="md-title" name="title" type="text" ng-model="entry.title" required aria-label="Title" flex>\n          <div ng-messages="questionDetailForm.title">\n            <div ng-message="required">\n              A title is required\n            </div>\n          </div>\n        </md-input-container>\n        <summernote   ng-model="entry.content" height="300"></summernote>\n      </div>\n    </md-card-content>\n    <span flex><!-- filler --></span>\n    <div layout="row">\n      <div class="up-down-votes" layout="column">\n        <md-button ng-click="upVote()" class="md-fab md-mini md-primary" style="font-size: 150%;">&#8593;</md-button>\n        <md-button class="md-fab md-mini" ng-disabled="true">{{entry.votes}}</md-button>\n        <md-button ng-click="downVote()" class="md-fab md-mini md-primary" style="font-size: 150%;">&#8595;</md-button>\n      </div>\n      <span flex><!-- filler --></span>\n      <div layout="column" layout-padding>\n        <span class="summary-small">Posted by {{entry.owner.name}} on {{entry.createdAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n        <span ng-show="entry.createdAt != entry.updatedAt" class="summary-small">Edited on {{entry.updatedAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n        <span flex><!-- filler --></span>\n        <md-card-actions>\n          <md-button ng-show="!isEditing" class="md-raised md-primary" ng-click="isEditing = true">Edit</md-button>\n          <md-button ng-show="isEditing" ng-disabled="questionDetailForm.$invalid || questionDetailForm.$pristine" ng-click="save()" class="md-raised md-primary">Save</md-button>\n          <md-button ng-show="isEditing" ng-click="isEditing = false" class="md-raised md-accent">Cancel</md-button>\n          <md-button ng-show="!isEditing" class="md-raised md-primary" ng-click="comment()">Comment</md-button>\n          <md-button ng-show="!isEditing" class="md-raised md-primary" ng-click="answer()">Answer</md-button>\n        </md-card-actions>\n      </div>\n    </div>\n  </form>\n</md-card>\n<div class="comments-container">\n  <comment comm="comment" ng-repeat="comment in entry.comments"></comment>\n</div>\n';

}
return __p
};

this["JST"]["assets/templates/entries/summary.tmpl.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<md-card layout-padding layout-fill ng-click="go()" class="entry-summary">\n  <md-card-title-text layout="column">\n    <span class="md-title"><span ng-show="entry.parent && entry.markedCorrect" style="color:green">&check;</span>{{entry.title}}</span>\n    <span class="md-subhead trix-content" ng-bind-html="entry.content | limitTo: 50">{{entry.content.length > 50 ? \'...\' : \'\'}}</span>\n    <span class="summary-small">Posted by {{entry.owner.name}} on {{entry.createdAt | amDateFormat: \'MMM Do, YYYY hh:mm a\'}}</span>\n  </md-card-title-text>\n</md-card>\n';

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
__p += '<main-content ng-controller="DashboardController as vm" layout-fill>\n  <div ng-hide="mc.user" class="container">\n    <div flex class="md-padding">\n      <div class="md-padding" layout="column" layout-align="center center">\n        <h3 flex>You are not logged in.</h3>\n        <div flex>\n          <md-button class="md-raised md-accent" ng-href="/login">Login here</md-button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div layout-gt-sm="row" layout="column" ng-show="mc.user" layout-fill class="content">\n    <md-tabs md-border-bottom md-autoselect flex="70" style="max-height: 100%;">\n      <md-tab label="Recent Activity">\n        <div layout-padding>\n          <span>Recent Activity goes here...</span>\n        </div>\n      </md-tab>\n      <md-tab label="Questions">\n        <div layout-padding>\n          <md-list>\n            <md-list-item ng-repeat="entry in vm.questions">\n              <entry-summary entry="entry" flex></entry-summary>\n            </md-list-item>\n          </md-list>\n        </div>\n      </md-tab>\n      <md-tab label="Answers">\n        <div layout-padding>\n          <md-list>\n            <md-list-item ng-repeat="entry in vm.answers">\n              <entry-summary entry="entry" flex></entry-summary>\n            </md-list-item>\n          </md-list>\n        </div>\n      </md-tab>\n      <md-tab label="Comments">\n        <div layout-padding>\n          <md-list>\n            <md-list-item ng-repeat="comment in vm.comments" class="md-3-line">\n              <comment comm="comment" flex class="single-comment"></comment>\n            </md-list-item>\n          </md-list>\n        </div>\n      </md-tab>\n    </md-tabs>\n    <profile user="mc.user"></profile>\n  </div>\n</main-content>\n';

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
__p += '<md-card class="md-whiteframe-9dp profile-frame">\n  <form name="profileForm">\n    <md-card-title>\n      <md-card-avatar>\n        <img class="md-user-avatar" ng-src="{{user.pictureUrl}}">\n      </md-card-avatar>\n      <span flex="5"><!-- Spacer --></span>\n      <md-card-title-text>\n        <span ng-show="vm.isEditing"><i>Editing</i></span>\n        <!-- Profile Name -->\n        <span ng-show="!vm.isEditing" class="md-headline">{{user.firstname}} {{user.lastname}}</span>\n        <div layout="row">\n          <md-input-container md-no-float ng-show="vm.isEditing" class="small-container">\n            <input type="text" ng-model="user.firstname" required aria-label="First Name" />\n          </md-input-container>\n          <md-input-container md-no-float ng-show="vm.isEditing" class="small-container">\n            <input type="text" ng-model="user.lastname" required aria-label="Last Name" />\n          </md-input-container>\n        </div>\n        <!-- Profile Email -->\n        <span ng-show="!vm.isEditing" class="md-subhead">{{user.email}}</span>\n        <md-input-container md-no-float ng-show="vm.isEditing" class="small-container">\n          <input type="email" ng-model="user.email" required aria-label="Email" />\n        </md-input-container>\n        <span class="md-subhead">Reputation: {{user.reputation}}</span>\n      </md-card-title-text>\n    </md-card-title>\n    <md-card-content>\n      <h3>Biography</h3>\n      <md-content ng-show="!vm.isEditing" class="profile-content">\n        <div class="trix-content" ng-bind-html="user.bio"></div>\n      </md-content>\n      <md-input-container ng-show="vm.isEditing" md-no-float>\n         <summernote   md-no-resize ng-model="user.bio"></summernote>\n      </md-input-container>\n    </md-card-content>\n    <md-card-actions layout-align="center center" layout-padding>\n      <md-card-icon-actions>\n        <md-button class="md-raised md-primary" ng-show="!vm.isEditing" ng-click="vm.isEditing = true">Edit</md-button>\n        <md-button class="md-raised md-primary" ng-show="vm.isEditing" ng-click="vm.save()">Save</md-button>\n        <md-button class="md-raised md-accent" ng-show="vm.isEditing" ng-click="vm.isEditing = false">Cancel</md-button>\n      </md-card-icon-actions>\n    </md-card-actions>\n    <md-input-container ng-show="vm.errors.length" md-no-float>\n      <div ng-show="vm.errors" ng-messages="profileForm">\n        <div ng-message-exp="true" ng-repeat="error in vm.errors">\n          {{error}}\n        </div>\n      </div>\n    </md-input-container>\n  </form>\n</md-card>\n';

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