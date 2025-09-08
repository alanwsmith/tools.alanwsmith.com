const content = [
  `alfa
bravo

charlie
delta`,
];

const style = document.createElement("style");
style.innerHTML = `
:host {
  display: block;
}

.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
  padding-inline: 1.2rem;
}

textarea {
  max-width: 16rem;
  height: 10rem;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}
`;

const template = `
<details>
  <summary>Line Prefixer</summary>
  <div class="wrapper">
    <div class="input-wrapper">
      <label for="line-prefixer-input">Input</label>
      <textarea class="in" id="line-prefixer-input"></textarea>
      <div>
        <label for="line-prefixer-prefix">Prefix</label>
        <input 
          type="text 
          size="10" 
          id="line-prefixer-prefix"
          value="[] ">
      </div>
    </div>

    <div class="output-wrapper">
      <div>Output</div>
      <textarea class="out"></textarea>
      <div class="copy-button"></div>
    </div>
  </div>
</details>
`;

class LinePrefixer extends HTMLElement {
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
    this.addCopyButton(".out", ".copy-button");
    this.loadExample(0);
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
    let prefix = this.getValue("#line-prefixer-prefix");
    let lines = this.getValue(".in").split("\n");
    let out = lines.map((line) => {
      if (line.trimEnd() != "") {
        return `${prefix}${line}`;
      }
    });
    this.setValue(".out", out.join("\n"));
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

customElements.define("line-prefixer", LinePrefixer);
