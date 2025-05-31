const content = [
  `a
ac
accumsan
adipicing
aenean
aliquam
aliquet
amet
ante
arcu
at
auctor
augue
bibendum
blandit
commodo
condimentum
congue
consectetur
consequat
convallis
cras
curabitur
dapibus
diam
dictum
dictumst
dignissim
dolor
donec
dui
duis
efficitur
egestas
eget
eleifend
elementum
elit
enim
erat
eros
est
et
etiam
eu
euismod
ex
facilisis
faucibus
felis
fermentum
feugiat
finibus
fringilla
fusce
gravida
habitasse
hac
iaculis
id
imperdiet
in
interdum
ipsum
justo
lacinia
lacus
laoreet
lectus
leo
libero
ligula
lobortis
lorem
luctus
maecenas
magna
malesuada
massa
mattis
mauris
maximus
metus
mi
molestie
mollis
morbi
nam
nec
neque
nibh
nisi
nisl
non
nulla
nullam
nunc
odio
orci
ornare
pellentesque
phasellus
platea
porta
porttitor
posuere
praesent
pretium
proin
purus
quam
quis
quisque
rhoncus
risus
rutrum
sagittis
sapien
scelerisque
sed
sem
semper
sit
sodales
sollicitudin
suscipit
tellus
tempor
tempus
tincidunt
tortor
tristique
turpis
ullamcorper
ultrices
ultricies
urna
ut
varius
vehicula
vel
velit
venenatis
vestibulum
vitae
vivamus
viverra
volutpat
vulputate`,
];

const style = document.createElement("style");
style.innerHTML = `
:host {
  display: block;
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
<details open>
  <summary>Lorem Ipsum</summary>
  <div class="wrapper">
    <div>Output</div>
    <textarea class="out"></textarea>
    <div>
<!--
      <input type="radio" name="kind" id="html-kind" value="html" checked>
      <label for="html-kind">html</label>
      <input type="radio" name="kind" id="text-kind" value="text">
      <label for="text-kind">text</label>
-->
    </div>
    <div class="copy-button"></div>
  </div>
</details>
`;

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class LoremIpsum extends HTMLElement {
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
    this.shadowRoot.addEventListener("changed", (event) => {
      this.processEvent.call(this, event);
    });
  }

  connectedCallback() {
    this.wrapper = this.loadWrapper();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(this.wrapper);
    this.shadowRoot.appendChild(style);
    this.addCopyButton(".out", ".copy-button");
    this.totalChars = 2000;
    this.makeOutput();
    this.addListeners();
  }

  el(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  getKind() {
    return this.shadowRoot.querySelector(`input[name="kind"]:checked`).value;
  }

  getParagraphs() {
    const paragraphs = [];
    const sentences = this.getSentences();
    for (let p = 0; p <= 1000; p++) {
      if (sentences.length === 0) {
        break;
      }
      const paragraph = [];
      for (let s = 0; s <= randomNumber(2, 6); s++) {
        if (sentences.length > 0) {
          paragraph.push(sentences.pop());
        }
      }
      let text = paragraph.join(" ");
      paragraphs.push(text);
    }
    return paragraphs;
  }

  getSentences() {
    const words = this.getWords();
    const sentences = [];
    for (let s = 0; s < 1000; s++) {
      if (words.length === 0) {
        break;
      }
      const sentence = [];
      const toPop = Math.min(words.length, randomNumber(3, 6));
      for (let w = 0; w < toPop; w++) {
        sentence.push(words.pop());
      }
      let text = `${sentence.join(" ")}.`;
      text = capitalizeWord(text);
      sentences.push(text);
    }
    return sentences.reverse(); // reverse to put Lorem ipsum first
  }

  getText() {
    const text = [];
    this.getParagraphs().forEach((p) => {
      text.push(`<p>\n  ${p}\n</p>`);
    });
    return text.join("\n");
  }

  getValue(selector) {
    return this.el(selector).value;
  }

  getWords() {
    let words = "";
    for (let adder = 0; adder <= 1000; adder++) {
      words += `${this.randomWord()} `;
      if (words.length > this.totalChars) {
        break;
      }
    }
    words += "ipsum Lorem";
    return words.split(" ");
  }

  loadWrapper() {
    const skeleton = this.ownerDocument.createElement("template");
    skeleton.innerHTML = template.trim();
    const wrapper = skeleton.content.cloneNode(true);
    return wrapper;
  }

  makeOutput() {
    console.log(this.getText());
    this.setValue(".out", this.getText());
  }

  processEvent(event) {
    if (event.type === "input") {
      this.makeOutput();
    }
  }

  // randomParagraph() {
  //   const sentences = [];
  //   for (let s = 0; s <= randomNumber(1, 5); s++) {
  //     sentences.push(this.randomSentence());
  //   }
  //   return sentences.join(" ");
  // }

  // randomSentence() {
  //   const words = [];
  //   for (let w = 0; w <= randomNumber(1, 9); w++) {
  //     words.push(this.randomWord());
  //   }
  //   return words.join(" ") + ".";
  // }

  // randomText() {
  //   const text = [];
  //   for (let p = 0; p <= randomNumber(3, 6); p++) {
  //     text.push(this.randomParagraph());
  //   }
  //   return text.join("\n");
  // }

  randomWord() {
    let words = content[0].split("\n");
    return words[Math.floor(Math.random() * words.length)];
  }

  setValue(selector, content) {
    const el = this.el(selector);
    el.value = content;
  }
}

customElements.define("lorem-ipsum", LoremIpsum);
