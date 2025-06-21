const content = [
  `example content goes
in this array. so you can
output multiples if necessary`,
];

const style = document.createElement("style");
style.innerHTML = `
:host {
  display: block;
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1rem;
  padding-inline: 1.2rem;
}

.output-wrapper {
  columns: 8ch;
}

textarea {
  max-width: 16rem;
  height: 10rem;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}

.temp {
  width: 9ch;
  text-align: center;
}

`;

const template = `
<details>
  <summary>Celsius and Fahrenheit</summary>
  <div class="wrapper">
    <div class="output-wrapper">
    </div>
  </div>
</details>
`;

function cToF(c) {
  return parseInt((c * 9 / 5) + 32, 10);
}

class CelsiusFahrenheit extends HTMLElement {
  constructor() {
    super();
  }

  addCopyButton(codeSelector, buttonParentSelector) {
    const codeEl = this.shadowRoot.querySelector(codeSelector);
    const buttonParentEl = this.shadowRoot.querySelector(buttonParentSelector);
    const copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy";
    copyButton.dataset.target = codeSelector;
    copyButton.addEventListener("click", async (event) => {
      const elToCopy = this.shadowRoot.querySelector(
        event.target.dataset.target,
      );
      try {
        let content;
        if (elToCopy.value) {
          content = elToCopy.value;
        } else {
          content = elToCopy.innerText;
        }
        await navigator.clipboard.writeText(content);
        event.target.innerHTML = "Copied";
      } catch (err) {
        event.target.innerHTML = "Error copying";
      }
      setTimeout(
        (theButton) => {
          event.target.innerHTML = "Copy";
        },
        2000,
        event.target,
      );
    });
    buttonParentEl.appendChild(copyButton);
  }

  addListeners() {
    this.shadowRoot.addEventListener("input", (event) => {
      this.processEvent.call(this, event);
    });
  }

  connectedCallback() {
    this.wrapper = this.loadWrapper();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.wrapper);
    this.shadowRoot.appendChild(style);
    // this.addCopyButton(".out", ".copy-button");
    // this.loadExample(0);
    this.makeOutput();
    this.addListeners();
  }

  el(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  getValue(selector) {
    return this.el(selector).value;
  }

  loadExample(index) {
    this.setValue(".in", content[index]);
  }

  loadWrapper() {
    const skeleton = this.ownerDocument.createElement("template");
    skeleton.innerHTML = template.trim();
    const wrapper = skeleton.content.cloneNode(true);
    return wrapper;
  }

  makeOutput() {
    for (let cTemp = 45; cTemp >= -10; cTemp--) {
      let newDiv = document.createElement("div");
      newDiv.classList.add("temp");
      newDiv.innerHTML = `${cTemp} ~${cToF(cTemp)}`;
      this.el(".output-wrapper").appendChild(newDiv);
    }
  }

  processEvent(event) {
    const kind = event.type;
    if (kind === "input") {
      this.makeOutput();
    }
  }

  setValue(selector, content) {
    const el = this.el(selector);
    el.value = content;
  }
}

customElements.define("celsius-fahrenheit", CelsiusFahrenheit);
