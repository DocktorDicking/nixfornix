# Nixfornix

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## TODO: 
* OPTIONAL: Create something which handles routing (routing service) or adding the routing logic to the state service which kind off makes sense. 
* REQUIRED: Create an AuthGuard which keeps routes safe until authentication is successful. Also check the admin flag here. This will keep people out untill they are logged in.
* REQUIRED: Connect API to Angular app and be greeted by bugs :) 
* UI: Fix styling of hour form which breaks css when phone is in landscape. Probebly some divs or css classes that cause this.
* SECURITY: For sessions and persistent sessions 'auth_password' needs to be changed to a secure token 'auth_token'. (JSON Web Tokens JWT)
* OPTIONAL: Add a loadingspinner which shows when the app is loading.
