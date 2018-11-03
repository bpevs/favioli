declare namespace NodeJS {
  interface Global {
    browser: any;
    chrome: any;
    document: any;
    navigator: any;
    testContext: any;
    window: any;
  }
}

declare namespace Window {
  interface window {
    browser: any;
    chrome: any;
  }
}

declare module "canvas" {
  var x: any;
  export = x;
}
