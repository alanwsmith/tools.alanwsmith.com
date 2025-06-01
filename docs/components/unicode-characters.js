const chars = `
▲
▼
◀
▶
▴
▾
▸
◂
●
○
◉
⇐
⇑
⇒
⇓
⇔
↵
←
↑
→
↓
↔
«
»
⌘
†
‡
⸸
™
©
₀
⁰
₁
¹
₂
²
₃
³
₄
⁴
₅
⁵
₆
⁶
₇
⁷
⁸
₈
₉
⁹
₍
⁽
₎ 
⁾ 
₊
⁺
₋
⁻
₌ 
⁼
ⁿ 
▀
▁
▂
▃
▄
▅
▆
▇
█ 
▉ 
▊
▋ 
▌ 
▍
▎
▏ 
▐
░
▒
▓
▔
▕
▖ 
▗
▘ 
▙
▚
▛
▜
▝
▞
▟
`;

const style = document.createElement("style");
style.innerHTML = `
:host {
  display: block;
}

button {
  width: 5ch;
  height: 4ch;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-inline: 1.2rem;
  font-size: 1.4em;
}`;

const template = `
<details open>
  <summary>Unicode Characters</summary>
  <div class="wrapper">
  </div>
</details>
`;

function dc(kind) {
  return document.createElement(kind);
}

class UnicodeCharacters extends HTMLElement {
  constructor() {
    super();
  }

  // addCopyButton(codeSelector, buttonParentSelector) {
  //   const codeEl = this.shadowRoot.querySelector(codeSelector);
  //   const buttonParentEl = this.shadowRoot.querySelector(buttonParentSelector);
  //   const copyButton = document.createElement("button");
  //   copyButton.innerHTML = "Copy";
  //   copyButton.dataset.target = codeSelector;
  //   copyButton.addEventListener("click", async (event) => {
  //     const elToCopy = this.shadowRoot.querySelector(
  //       event.target.dataset.target,
  //     );
  //     try {
  //       let content;
  //       if (elToCopy.value) {
  //         content = elToCopy.value;
  //       } else {
  //         content = elToCopy.innerText;
  //       }
  //       await navigator.clipboard.writeText(content);
  //       event.target.innerHTML = "Copied";
  //     } catch (err) {
  //       event.target.innerHTML = "Error copying";
  //     }
  //     setTimeout(
  //       (theButton) => {
  //         event.target.innerHTML = "Copy";
  //       },
  //       2000,
  //       event.target,
  //     );
  //   });
  //   buttonParentEl.appendChild(copyButton);
  // }

  addChars() {
    chars.split("\n").forEach((c) => {
      if (c !== "") {
        const button = dc("button");
        button.addEventListener("click", async (event) => {
          await navigator.clipboard.writeText(button.innerHTML);
        });

        button.innerHTML = c;
        this.el(".wrapper").append(button);
      }
    });
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
    this.addChars();
  }

  el(selector) {
    return this.shadowRoot.querySelector(selector);
  }

  getValue(selector) {
    // return this.el(selector).value;
  }

  loadExample(index) {
    //this.setValue(".in", content[index]);
  }

  loadWrapper() {
    const skeleton = this.ownerDocument.createElement("template");
    skeleton.innerHTML = template.trim();
    const wrapper = skeleton.content.cloneNode(true);
    return wrapper;
  }

  makeOutput() {
    this.setValue(".out", this.getValue(".in"));
  }

  processEvent(event) {
    // const kind = event.type;
    // if (kind === "input") {
    //   this.makeOutput();
    // }
  }

  setValue(selector, content) {
    // const el = this.el(selector);
    // el.value = content;
  }
}

customElements.define("unicode-characters", UnicodeCharacters);
