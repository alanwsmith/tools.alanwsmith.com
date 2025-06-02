const content = [
  `alfa bravo charlie
Delta ECHO

foxTROT Golf`,
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
<details open>
  <summary>Change Case</summary>
  <div class="wrapper">
      <div>
        <p>Input</p>
        <textarea class="in"></textarea>
        <div>
            <input id="list" type="radio" name="lines" value="lower" checked />
            <label for="list">lower case</label>
        </div>
        <div>
            <input id="numbered" type="radio" name="lines" value="upper" />
            <label for="numbered">upper case</label>
        </div>
        <div>
            <input id="capitals-leave-uppers" type="radio" name="lines" value="capitals-leave-uppers" />
            <label for="capitals-leave-uppers">capitals (leave uppers)</label>
        </div>
        <div>
            <input id="capitals-lower-uppers" type="radio" name="lines" value="capitals-lower-uppers" />
            <label for="capitals-lower-uppers">capitals (lower uppers)</label>
        </div>
        <div>
            <input id="sentence-leave-uppers" type="radio" name="lines" value="sentence-leave-uppers" />
            <label for="sentence-leave-uppers">sentence (leave uppers)</label>
        </div>
        <div>
            <input id="sentence-lower-uppers" type="radio" name="lines" value="sentence-lower-uppers" />
            <label for="sentence-lower-uppers">sentence (lower uppers)</label>
        </div>
<div>
TODO: Add <a href="https://daringfireball.net/2008/05/title_case">Title Case</a>
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

class ChangeCase extends HTMLElement {
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
      .map((input, index) => {
        const checked =
          this.shadowRoot.querySelector(`input[name="lines"]:checked`).value;
        if (
          checked === "lower"
        ) {
          return input.toLowerCase();
        } else if (checked === "upper") {
          return input.toUpperCase();
        } else if (checked === "capitals-leave-uppers") {
          return input.split(" ").map((word) => {
            return String(word).charAt(0).toUpperCase() + String(word).slice(1);
          }).join(" ");
        } else if (checked === "capitals-lower-uppers") {
          return input.split(" ").map((word) => {
            const lowered = word.toLowerCase();
            return String(lowered).charAt(0).toUpperCase() +
              String(lowered).slice(1);
          }).join(" ");
        } else if (checked === "sentence-leave-uppers") {
          return String(input).charAt(0).toUpperCase() + String(input).slice(1);
        } else if (checked === "sentence-lower-uppers") {
          const lowered = input.toLowerCase();
          return String(lowered).charAt(0).toUpperCase() +
            String(lowered).slice(1);
        } else {
          return `something went weird. time to debug`;
        }
      });
    let out = `${output.join("\n")}\n\n`;
    this.out.innerHTML = out;
  }

  wrapper() {
    const wrapper = this.ownerDocument.createElement("template");
    wrapper.innerHTML = template.trim();
    return wrapper;
  }
}

customElements.define("change-case", ChangeCase);
