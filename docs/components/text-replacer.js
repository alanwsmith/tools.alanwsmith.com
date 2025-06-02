const content = [
  `brown|fox|lazy|dog

powderblue|seal|cozy|cougar

mediumorchid|giant panda|blindfolded|sloth
`,

  `The quick VAR1 VAR2
jumped over the VAR3 VAR4
`,
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
}
textarea {
  width: 100%;
  height: 10rem;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}
`;

const template = `
<details open >
  <summary>Text Replacer</summary>
  <div class="wrapper">
    <div>
      <div>
        <p>Input</p>
        <textarea class="in"></textarea>
      </div>
    </div>
    <div>
      <p>Template</p>
    <textarea class="template"></textarea>
    </div>
  </div>
      <div>
        <p>Output</p>
        <textarea class="out"></textarea>
	<div class="copy-button"></div>
      </div>
</details>
`;

class TextReplacer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  addCopyButtonTo(codeSelector, buttonParentSelector) {
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

  connectedCallback() {
    this.wrapper = this.wrapper().content.cloneNode(true);
    this.shadowRoot.appendChild(this.wrapper);
    this.shadowRoot.appendChild(style);
    this.in = this.shadowRoot.querySelector(".in");
    this.template = this.shadowRoot.querySelector(".template");
    this.out = this.shadowRoot.querySelector(".out");
    this.loadExample();
    this.makeOutput(this.in);
    this.addCopyButtonTo(".out", ".copy-button");
    this.shadowRoot.addEventListener("input", () => {
      this.makeOutput.call(this);
    });
  }

  loadExample() {
    this.in.value = content[0];
    this.template.value = content[1];
  }

  makeOutput() {
    let inputs = this.in.value.split("\n");
    const output = inputs
      .filter((input) => {
        if (input.split("|").length > 1) {
          return true;
        } else {
          return false;
        }
      })
      .map((input) => {
        const vars = input.split("|");
        let instance = this.template.value;
        for (let num = 1; num <= vars.length; num++) {
          instance = instance.replaceAll(`VAR${num}`, vars[num - 1]);
        }
        return instance;
      });
    this.out.innerHTML = output.join("\n");
  }

  wrapper() {
    const wrapper = this.ownerDocument.createElement("template");
    wrapper.innerHTML = template.trim();
    return wrapper;
  }
}

customElements.define("text-replacer", TextReplacer);
