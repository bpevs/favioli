export const styles = `
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
    z-index: 2;
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
    user-select: none;
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
    height: 32px;
    line-height: 1;
    margin-top: 0;
    padding: 4px 0;
    transition: background ease 0.2s;
    user-select: none;
    vertical-align: middle;
    width: 1.3rem;
  }


  button:hover, button:focus {
    background: #ddd;
  }
`;
