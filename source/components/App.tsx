import { React } from "../deps.ts";
import { OPTIONS_ROUTE } from "../constants.ts";
import NavBar from "./NavBar.tsx";
import Checkbox from "./Checkbox.tsx";
import ListFaviconInput from "./ListFaviconInput.tsx";

const { BYPASSED_SITES, FAVICONS, SETTINGS } = OPTIONS_ROUTE;


async function setOptions(options) { console.log(optoins); }


export function App(props) {
  const [currRoute, setRoute] = React.useState(FAVICONS);
  const [status, setStatus] = React.useState('');
  const options = {};

  const changeRoute = React.useCallback(evt => {
    const routeName = evt?.target?.href?.match(/\#(.*)/)[1];
    if (routeName) setRoute(routeName);
  }, []);

  const saveOptions = React.useCallback(async() => {
    await setOptions(options);

    setStatus('Successfully Saved');

    window.setTimeout(() => setStatus(''), 1000)
  });

  const pages = {
    OVERRIDES: <OverridesList
      onChange={this._updateOptions.bind(this)}
      overrides={overrides}
    />,
    SETTINGS: (<div>
      <Checkbox
        checked={flagReplaced}
        name="flagReplaced"
        onChange={this._updateOptions.bind(this)}
      />
    </div>),
    SKIPPED: <SkipsList
      onChange={this._updateOptions.bind(this)}
      skips={skips}
    />,
  };

  return (
    <div>
      <NavBar
        onSelect={changeRoute}
        route={currRoute}
      />
      <div className="page">
        <h1 className="title">{route}</h1>
        {pages[route]}
        <button
          children="Save"
          className="save"
          onClick={this._saveOptions.bind(this)}
        />
      </div>
      <div id="status">{status}</div>
    </div>
  );
}
