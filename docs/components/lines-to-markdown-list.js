const content = [
  `Drop the ashes on the worn old rug.
Mark the spot with a sign painted red.
When you hear the bell, come quickly.

Tuck the sheet under the edge of the mat.

Wake and rise, and step into the green outdoors.

`,
];

const style = document.createElement("style");
style.innerHTML = `
:host {
  display: block;
}
* {
  margin: 0;
}
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
	margin-top: 1rem;
	padding-inline: 1.2rem;
}
textarea {
  width: 16rem;
  height: 10rem;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}
`;

const template = `
<details open >
  <summary>Lines To Markdown List</summary>
  <div class="wrapper">
      <div>
        <p>Input</p>
        <textarea class="in"></textarea>
        <div>
            <input id="list" type="radio" name="lines" value="list" checked />
            <label for="list">List</label>
        </div>
        <div>
            <input id="numbered" type="radio" name="lines" value="numbered" />
            <label for="numbered">Numbered</label>
        </div>
      </div>
      <div>
        <p>Output</p>
        <textarea class="out"></textarea>
	<div class="copy-button"></div>
      </div>
    </div>
</details>
`;

class LinesToMarkdownList extends HTMLElement {
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
    this.out = this.shadowRoot.querySelector(".out");
    this.loadExample();
    this.makeOutput(this.in);
    this.addCopyButtonTo(".out", ".copy-button");
    this.in.addEventListener("input", (event) => {
      this.makeOutput.call(this, event.target);
    });
    this.shadowRoot.addEventListener("change", (event) => {
      this.makeOutput.call(this, event);
    });
  }

  loadExample() {
    this.in.innerHTML = content[0];
  }

  makeOutput(el) {
    let inputs = this.in.value.split("\n");

    const output = inputs
      .filter((input) => {
        if (input.trim().length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .map((input, index) => {
        if (
          this.shadowRoot.querySelector(`input[name="lines"]:checked`).value ===
            "numbered"
        ) {
          return `${index + 1}. ${input}`;
        } else {
          return `- ${input}`;
        }
      });
    let out = `${output.join("\n\n")}\n\n`;
    this.out.innerHTML = out;
  }

  wrapper() {
    const wrapper = this.ownerDocument.createElement("template");
    wrapper.innerHTML = template.trim();
    return wrapper;
  }
}

customElements.define("lines-to-markdown-list", LinesToMarkdownList);
