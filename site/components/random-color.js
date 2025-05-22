const content = `aliceblue
antiquewhite
aqua
aquamarine
azure
beige
bisque
black
blanchedalmond
blue
blueviolet
brown
burlywood
cadetblue
chartreuse
chocolate
coral
cornflowerblue
cornsilk
crimson
cyan
darkblue
darkcyan
darkgoldenrod
darkgray
darkgreen
darkgrey
darkkhaki
darkmagenta
darkolivegreen
darkorange
darkorchid
darkred
darksalmon
darkseagreen
darkslateblue
darkslategray
darkslategrey
darkturquoise
darkviolet
deeppink
deepskyblue
dimgray
dimgrey
dodgerblue
firebrick
floralwhite
forestgreen
fuchsia
gainsboro
ghostwhite
gold
goldenrod
gray
green
greenyellow
grey
honeydew
hotpink
indianred
indigo
ivory
khaki
lavender
lavenderblush
lawngreen
lemonchiffon
lightblue
lightcoral
lightcyan
lightgoldenrodyellow
lightgray
lightgreen
lightgrey
lightpink
lightsalmon
lightseagreen
lightskyblue
lightslategray
lightslategrey
lightsteelblue
lightyellow
lime
limegreen
linen
magenta
maroon
mediumaquamarine
mediumblue
mediumorchid
mediumpurple
mediumseagreen
mediumslateblue
mediumspringgreen
mediumturquoise
mediumvioletred
midnightblue
mintcream
mistyrose
moccasin
navajowhite
navy
oldlace
olive
olivedrab
orange
orangered
orchid
palegoldenrod
palegreen
paleturquoise
palevioletred
papayawhip
peachpuff
peru
pink
plum
powderblue
purple
red
rosybrown
royalblue
saddlebrown
salmon
sandybrown
seagreen
seashell
sienna
silver
skyblue
slateblue
slategray
slategrey
snow
springgreen
steelblue
tan
teal
thistle
tomato
turquoise
violet
wheat
white
whitesmoke
yellow
yellowgreen`;

const style = document.createElement("style");
style.innerHTML = `
:host {
  display: block;
}
:host > :where(:not(:first-child)) {
  margin-top: var(--flow-space, 1em);
}
* {
  margin: 0;
}
.wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 2rem;
}
.color-chip {
  height: 2rem;
  background-color: var(--the-color);
}
.color-name {
  color: var(--the-color);
}
`;

const template = `
<h3>Random HTML Color</h3>
<div class="wrapper">
  <div class="color-name"></div>
  <div class="color-chip"></div>
  <button>Get another one</button>
  <div class="copy-button-wrapper"></div>
</div>
`;

class RandomColor extends HTMLElement {
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

	addListeners() {
		this.shadowRoot.querySelector("button").addEventListener("click", () => {
			this.loadColor();
		});
	}

	connectedCallback() {
		this.colors = content.split("\n");
		this.wrapper = this.wrapper().content.cloneNode(true);
		this.shadowRoot.appendChild(this.wrapper);
		this.shadowRoot.appendChild(style);
		this.colorVarSheet = document.createElement("style");
		this.shadowRoot.appendChild(this.colorVarSheet);
		this.addCopyButtonTo(".color-name", ".copy-button-wrapper");
		this.addListeners();
		this.loadColor();
	}

	loadColor() {
		const randomIndex = Math.floor(Math.random() * this.colors.length) + 1;
		const color = this.colors[randomIndex];
		this.shadowRoot.querySelector(".color-name").innerHTML = color;
		this.colorVarSheet.innerHTML = `:host { --the-color: ${color}; }`;
	}

	wrapper() {
		const wrapper = this.ownerDocument.createElement("template");
		wrapper.innerHTML = template.trim();
		return wrapper;
	}
}

customElements.define("random-color", RandomColor);
