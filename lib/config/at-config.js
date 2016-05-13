var toggleATDisplay = function() {
  $(".mvl-signout-button").toggle();
  //$(".mvl-changePwd-div").toggle();
  $(".at-form").toggle();
};

var onSignOut = function() {
  toggleATDisplay();
};

var onSignIn = function(err, state) {

  if(err == undefined) {
    if (state != "changePwd" && state != "forgotPwd") {
      toggleATDisplay();
    }
  }
};

AccountsTemplates.configure({
  // Behavior
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,
  lowercaseUsername: false,
  focusFirstInput: true,

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,

  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: false, // this adds checkbox to input, until we can figure out how to clear it, leave it off
  showValidating: true,

  // Privacy Policy and Terms of Use
  privacyUrl: 'privacy',
  termsUrl: 'terms-of-use',

  // Redirects
  homeRoutePath: '/home',
  redirectTimeout: 4000,

  // Hooks
  onLogoutHook: onSignOut,
  onSubmitHook: onSignIn,
  //preSignUpHook: myPreSubmitFunc,
  //postSignUpHook: myPostSubmitFunc,

  // Texts
  texts: {
    button: {
      signUp: "Register Now!"
    },
    socialSignUp: "Register",
    socialIcons: {
      "meteor-developer": "fa fa-rocket"
    },
    title: {
      forgotPwd: "Recover Your Password"
    },
    errors: {
      accountsCreationDisabled: "Client side accounts creation is disabled!!!",
      cannotRemoveService: "Cannot remove the only active service!",
      captchaVerification: "Captcha verification failed!",
      loginForbidden: "Unable to login. Could be lots of things, but try re-typing your (case-sensitive) password first.",
      mustBeLoggedIn: "error.accounts.Must be logged in",
      pwdMismatch: "error.pwdsDontMatch",
      validationErrors: "Validation Errors",
      verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",
    }
  }
});

