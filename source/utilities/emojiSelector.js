/*! @source Based off: https://github.com/Kiricon/emoji-selector */
import "fun-tabs";
import { emojis } from "../constants/emojis";

const template = document.createElement("template");
const contentContainers = {};
const createdTabs = {};
let tabTemplate = ``;

emojis.forEach(emoji => {
  const { category, char, name } = emoji;

  if(createdTabs[category] === undefined) {
    createdTabs[category] = true;
    contentContainers[category] = "<div class='container'>";
    tabTemplate += `<fun-tab>${char}</fun-tab>`
  }

  contentContainers[category] += `<div class="emoji">${char}</div>`;
});

let contentTemplate = ``;
for(let categoryName in contentContainers) {
  contentTemplate += `${contentContainers[categoryName]}</div>`;
}

template.innerHTML = `
  <style>
    #emojiPopup {
      background: white;
      border-radius: 150px;
      box-shadow:
        0 3px 6px rgba(0,0,0,0.16),
        0 3px 6px rgba(0,0,0,0.23);
      height: 0px;
      margin-left: 150px;
      margin-top: 150px;
      overflow: hidden;
      position: absolute;
      transition: all ease 0.5s;
      width: 0px;
      will-change: opacity, margin, height, width;
    }

    #emojiPopup.open {
      border-radius: 3px;
      display: block;
      height: 16em;
      margin-left: 0px;
      margin-top: 0px;
      width: 16em;
    }

    #emojiPopup.open .container, #emojiPopup.open fun-tabs {
      opacity: 1;
      transition-delay: 0.5s;
    }

    .content {
      height: 14em;
      width: 16em;
      overflow:hidden;
      text-align: center;
    }

    .container {
      display: none;
      height: calc(100% - 1.6em);
      opacity: 0;
      overflow-y: auto;
      padding: 0.8em 1em 2em 1em;
      text-align: left;
      transition: ease opacity 0.3s;
    }

    .container.selected  {
      display: block;
    }

    .emoji,
    fun-tab {
      background: white;
      border-radius: 3px;
      cursor: pointer;
      display: inline-block;
      height: 1em;
      padding: 0.2em;
      line-height: 1;
      text-align: center;
      transition: ease background 0.2s;
      width: 1em;
    }

    fun-tabs {
      border-bottom: solid 1px #eee;
      height: 1.5em;
      margin: 0px auto;
      opacity: 0;
      transition: ease opacity 0.2s;
      width: 16em;
    }

    fun-tab {
      padding: 0.45em 0.5em 0.5em 0.5em;
    }

    fun-tab:hover,
    .emoji:hover {
      background: #eee;
    }

    button {
      background: #eee;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 1rem;
      height: 1.3rem;
      line-height: 1;
      margin: 0;
      padding: 0.25rem 0.1rem 0.25rem 0.1rem;
      transition: background ease 0.2s;
      width: 1.3rem;
    }

    button:focus {
      outline: none;
    }

    button:hover {
      background: #ccc;
    }
  </style>
  <button>😀</button>
  <div id="emojiPopup">
    <fun-tabs selected="0">${tabTemplate}</fun-tabs>
    <div class="content">${contentTemplate}</div>
  </div>
`;

class EmojiSelector extends HTMLElement {
  constructor() {
    super();

    // Create shadow root for any children context
    this.attachShadow({ mode: "open" });

    if (!this.shadowRoot) return;

    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.openButton = this.shadowRoot.querySelector("button");
    this.popupWindow = this.shadowRoot.querySelector("#emojiPopup");
    this.svg = this.shadowRoot.querySelector("svg");
    this.tabContainer = this.shadowRoot.querySelector("fun-tabs");

    this.containers = this.shadowRoot.querySelectorAll(".container");
    this.emojis = this.shadowRoot.querySelectorAll(".emoji");
    this.tabs = this.shadowRoot.querySelectorAll("fun-tab");
  }

  // Called after your element is attached to the DOM
  connectedCallback() {
    this.containers[0].className = "container selected";

    for (let index = 0; index < this.tabs.length; index++) {
      const currentContainer = this.containers[index];
      const currentTab = this.tabs[index];

      currentTab.addEventListener("click", this.tabSelected.bind(this, currentContainer));
      currentContainer.addEventListener("click", this.emojiSelected.bind(this));
    }

    window.addEventListener("click", this.hide.bind(this));
    this.openButton.addEventListener("click", this.show.bind(this), true);
    this.popupWindow.addEventListener("click", e => e.stopPropagation());


    const size = this.getAttribute("size");
    if (size != null) {
      this.openButton.style.height = size;
      this.openButton.style.width = size;

      const sizeInt = size.replace("px", "");
      this.svg.style.height = sizeInt;
      this.svg.style.height = sizeInt;
    }
  }

  emojiSelected(event) {
    this.openButton.innerHTML = event.target.innerHTML;
    this.dispatchEvent(new CustomEvent("emoji-selected", {
      bubbles: true,
      detail: event.target.innerHTML
    }));
  }

  tabSelected(container, event) {
    this.containers.forEach(container => container.className = "container");
    container.className += " selected";
  }

  show(e) {
    e.stopPropagation();
    const left = `${e.clientX - 150}px`;
    const top = `${e.clientY - 150}px`;
    Object.assign(this.popupWindow, {
      className: "open",
      style: { left, top },
    })
  }

  hide(e) {
    this.popupWindow.className = "";
  }
}

customElements.define("emoji-selector", EmojiSelector);
