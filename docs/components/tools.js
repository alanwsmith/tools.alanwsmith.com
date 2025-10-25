export default class {
  // WORK IN PROGRESS
  #path = new URL(window.location.href).pathname;

  bittyInit() {
    this.initDetails();
  }

  initDetails() {
    const detailsEls = this.api.querySelectorAll("details");
    console.log(detailsEls);
  }
}

export class CssCharacterWrapper {
}