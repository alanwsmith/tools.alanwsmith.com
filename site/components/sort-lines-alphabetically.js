const content = [
	`delta
foxtrot

echo
bravo
alfa

charlie`,
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
  width: 16rem;
  height: 10rem;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
}
`;

const template = `
<details>
  <summary>Sort Lines Alphabetically</summary>
  <div class="wrapper">
      <div>
        <p>Input</p>
        <textarea class="in"></textarea>
        <div>
            <input id="smushed" type="radio" name="lines" value="smushed" checked/>
            <label for="smushed">Smushed</label>
        </div>
        <div>
            <input id="spaced" type="radio" name="lines" value="spaced" />
            <label for="spaced">Spaced</label>
        </div>
        <div>
            <input id="list" type="radio" name="lines" value="list" />
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

class SortLinesAlphabetically extends HTMLElement {
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
			this.makeOutput.call(this);
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
			.sort((a, b) => {
				const aCheck = a.toLowerCase();
				const bCheck = b.toLowerCase();
				if (aCheck < bCheck) {
					return -1;
				}
				if (aCheck > bCheck) {
					return 1;
				}
				return 0;
			});
		let checked = this.shadowRoot.querySelector(
			'input[name="lines"]:checked',
		).value;
		if (checked === "smushed") {
			let out = `${output.join("\n")}\n\n`;
			this.out.innerHTML = out;
		} else if (checked === "spaced") {
			let out = `${output.join("\n\n")}\n\n`;
			this.out.innerHTML = out;
		} else if (checked === "list") {
			let out = `- ${output.join("\n\n- ")}\n\n`;
			this.out.innerHTML = out;
		} else if (checked === "numbered") {
			let out = `${output
				.map((line, index) => {
					return `${index + 1}. ${line}`;
				})
				.join("\n\n")}\n\n`;
			this.out.innerHTML = out;
		} else {
			this.out.innerHTML = `something went weird.\ntime to debug`;
		}
	}

	wrapper() {
		const wrapper = this.ownerDocument.createElement("template");
		wrapper.innerHTML = template.trim();
		return wrapper;
	}
}

customElements.define("sort-lines-alphabetically", SortLinesAlphabetically);
