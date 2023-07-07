// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// TODO Remove the labels in this file when we ever invent i18n for this application. For now.. behold this.. spaghetti patch

export const environment = {
  production: false,
  API_URL: 'http://localhost:8080',
  logo_path: '../../assets/img/nix4nix-logo-alt-trans.png',
  version: 'v0.9.8.1',
  locationLabel: 'Locatie'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
