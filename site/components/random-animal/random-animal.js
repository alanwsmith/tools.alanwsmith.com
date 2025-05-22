const content = `Aardvark
Albatross
Alligator
Alpaca
Ant
Anteater
Antelope
Ape
Armadillo
Baboon
Badger
Barracuda
Bat
Bear
Bearcat
Beaver
Bee
Beetle
Bird
Boar
Bobcat
Buffalo
Bull
Butterfly
Camel
Cardinal
Cat
Chamois
Cheetah
Chicken
Chimpanzee
Chinchilla
Chough
Cobra
Cougar
Cow
Crab
Crane
Crocodile
Crow
Deer
Dog
Dolphin
Donkey
Dove
Dragonfly
Duck
Eagle
Eel
Elephant
Elephant seal
Elk
Wapiti
Emu
Falcon
Ferret
Finch
Fish
Flamingo
Fox
Frog
Gazelle
Gecko
Gerbil
Giant Panda
Giraffe
Gnu
Goat
Goldfinch
Goosander
Goose
Gorilla
Grasshopper
Grouse
Guanaco
Guinea pig
Gull
Hamster
Hare
Hawk
Hedgehog
Hermit Crab
Heron
Herring
Hippopotamus
Horse
Hummingbird
Hyena
Ibex
Ibis
Iguana
Impala
Jaguar
Jay
Jellyfish
Kangaroo
Kingbird
Katinka
Kite
Koala
Komodo dragon
Ladybug
Lapwing
Lark
Lemur
Leopard
Lion
Lizard
Llama
Lobster
Loris
Louse
Lyrebird
Mallard
Manatee
Mandrill
Margay
Meerkat
Mink
Mole
Mongoose
Monkey
Moose
Moth
Mouse
Narwhal
Newt
Nightingale
Okapi
Opossum
Ostrich
Otter
Ox
Owl
Oyster
Panther
Parrot
Panda
Giant Panda
Partridge
Peacock
Peafowl
Peccary
Pelican
Penguin
Pheasant
Pig
Pigeon
Platypus
Polar bear
Pony
Parakeet
Porcupine
Porpoise
Prairie dog
Pug
Quail
Rabbit
Raccoon
Ram
Raven
Red deer
Red panda
Rhinoceros
Rook
Salamander
Salmon
Sandpiper
Sardine
Sea lion
Seahorse
Seal
Sea otter
Shark
Sheep
Shrew
Skink
Skipper
Skunk
Sloth
Snail
Spiny Anteater
Spoonbill
Squid
Squirrel
Starfish
Starling
Stilt
Stingray
Swan
Tapir
Tarsier
Thrush
Tiger
Toad
Toucan
Turkey
Turtle
Wallaby
Walrus
Weasel
Whale
Wildebeest
Wolf
Wolverine
Wombat
Zebra`;

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
`;

const template = `
<h3>Random Animal</h3>
<div class="wrapper">
  <div class="animal-name"></div>
  <button>Get another one</button>
</div>
`;

class RandomColor extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
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
		this.loadColor();
	}

	loadColor() {
		const randomIndex = Math.floor(Math.random() * this.colors.length) + 1;
		const color = this.colors[randomIndex];
		this.shadowRoot.querySelector(".animal-name").innerHTML = color;
	}

	wrapper() {
		const wrapper = this.ownerDocument.createElement("template");
		wrapper.innerHTML = template.trim();
		return wrapper;
	}
}

customElements.define("random-animal", RandomColor);
