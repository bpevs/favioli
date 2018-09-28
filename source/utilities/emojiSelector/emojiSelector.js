/*! @source Based off: https://github.com/Kiricon/emoji-selector */
import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";
import "fun-tabs";
import { emojis } from "../../constants/emojis";
import { styles } from "../../stylesheets/emojiSelectorStyles";

const template = document.createElement("template");
const contentContainers = {};
const createdTabs = {};
let tabTemplate = ``;

emojis.forEach(emoji => {
  const { category, char } = emoji;

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
  <style>${styles}</style>
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

    if (
      this.attributes.defaultValue &&
      this.attributes.defaultValue.value
  ) {
      this.openButton.innerHTML = this.attributes.defaultValue.value;
      this.attributes.value = { value: this.attributes.defaultValue.value };
    }
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

    window.addEventListener("click", e => {
      const isNotEmojiSelector = e && e.target !== this;
      if (isNotEmojiSelector) this.hide();
    });
    this.openButton.addEventListener("click", (...args) => {
      const isOpen = this.popupWindow.className.length > 0;
      isOpen ? this.hide() : this.show.apply(this, args);
    }, true);
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
    if (event.target.innerHTML.length > 20) return;
    this.openButton.innerHTML = event.target.innerHTML;
    this.attributes.value.value = event.target.innerHTML;
    this.dispatchEvent(new CustomEvent("change", {
      bubbles: true,
      detail: event.target.innerHTML
    }));
    this.hide();
  }

  tabSelected(container, event) {
    this.containers.forEach(container => container.className = "container");
    container.className += " selected";
  }

  show(e) {
    const left = `${e.clientX - 150}px`;
    const top = `${e.clientY - 150}px`;
    Object.assign(this.popupWindow, {
      className: "open",
      style: { left, top },
    });
  }

  hide(e) {
    this.popupWindow.className = "";
  }
}

customElements.define("emoji-selector", EmojiSelector);

export function createEmojiSelector(filter, emoji) {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <input class="site-selector" type="text" value="${filter}" />
    <emoji-selector class="emoji-selector" defaultValue="${emoji}"></emoji-selector>
    <button class="remove-button">X</button>
  `;
  return wrapper;
}
