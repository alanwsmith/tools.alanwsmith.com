const content = `Add salt before you fry the egg.
Be sure to set the lamp firmly in the hole.
Beat the dust from the rug onto the lawn.
Breathe deep and smell the piny air.
Bring your best compass to the third class.
Cap the jar with a tight brass cover.
Crack the walnut with your sharp side teeth.
Cut the pie into large parts.
Dip the pail once and let it settle.
Draw the chart with heavy black lines.
Drop the ashes on the worn old rug.
Fasten two pins on each side.
Fly by night, and you waste little time.
Glue the sheet to the dark blue background.
Go now and come here later.
Greet the new guests and leave quickly.
Guess the results from the first scores.
Hang tinsel from both branches.
Heave the line over the port side.
Help the weak to preserve their strength.
Hoist it up and take it away.
Hold the hammer near the end to drive the nail.
Hurdle the pit with the aid of a long pole.
Pull the dart from the cork target.
Keep the hatch tight and the watch constant.
Let it burn, it gives us warmth and comfort.
Lift the square stone over the fence.
Loop the braid to the left and then over.
Mark the spot with a sign painted red.
Open the crate but don't break the glass.
Open your book to the first page.
Pack the kits and don't forget the salt.
Paint the sockets in the wall dull green.
Pick a card and slip it under the pack.
Pile the coal high in the shed corner.
Pitch the straw through the door of the stable.
Pluck the bright rose without leaves.
Pour the stew from the pot into the plate.
Put the chart on the mantel and tack it down.
Raise the sail and steer the ship northward.
Say it slowly but make it ring clear.
Screen the porch with woven straw mats.
Send the stuff in a thick paper bag.
Set the piece here and say nothing.
Shut the hatch before the waves push it in.
Slide the catch back and open the desk.
Slide the tray across the glass top.
Split the log with a quick, sharp blow.
Tack the strip of carpet to the worn floor.
Take the match and strike it against your shoe.
Take the winding path to reach the lake.
Tear a thin sheet from the yellow pad.
Tend the sheep while the dog wanders.
Throw out the used paper cup and plate.
Tuck the sheet under the edge of the mat.
Turn on the lantern which gives us light.
Twist the valve and release hot steam.
Use a pencil to write the first draft.
Wake and rise, and step into the green outdoors.
Weave the carpet on the right hand side.
When you hear the bell, come quickly.
Write at once or you may forget it.`;

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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}
.color-chip {
  height: 2rem;
  background-color: var(--the-color);
}
.color-name {
  color: var(--the-color);
}
.wrapper {
	margin-top: 1.4rem;
	padding-inline: 2.2rem;
}
`;

const template = `
<details open>
	<summary>Random Sentence</summary>
	<div class="wrapper">
  		<div class="animal-name"></div>
  		<button>Get another one</button>
		<div class="copy-button"></div>
	</div>
</details>
`;

class RandomSentence extends HTMLElement {
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
		this.addListeners();
		this.addCopyButtonTo(".animal-name", ".copy-button");
		this.loadColor();
	}

	loadColor() {
		const randomIndex = Math.floor(Math.random() * this.colors.length);
		const color = this.colors[randomIndex];
		this.shadowRoot.querySelector(".animal-name").innerHTML = color;
	}

	wrapper() {
		const wrapper = this.ownerDocument.createElement("template");
		wrapper.innerHTML = template.trim();
		return wrapper;
	}
}

customElements.define("random-sentence", RandomSentence);
