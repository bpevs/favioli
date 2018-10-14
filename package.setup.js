const { readFileSync, writeFileSync } = require("fs")
const { execSync } = require("child_process")

const browsers = {
  chrome: {
    color: "\x1b[32m",
    omits: [ "applications", "options_ui" ]
  },
  firefox: {
    color: "\x1b[91m",
    omits: [ "options_page" ]
  },
}

console.log("\x1b[37mPackager\n========\x1b[0m")

Object.keys(browsers).forEach(id => {
  const dist = `./dist/${id}`

  // Copy JS/HTML/CSS/ICONS
  execSync(`mkdir -p ${dist}/icons`)
  execSync(`cp -r ./resources/icons/* ${dist}/icons`)
  execSync(`cp -r ./dist/base/* ${dist}`)

  // Transform Manifest
  const manifest = JSON.parse(readFileSync("manifest.json", "utf8"))
  const browser = browsers[id]
  browser.omits.forEach(omit => delete manifest[omit])

  writeFileSync(dist + "/manifest.json", JSON.stringify(manifest, null, 2))

  console.log(`Built for \x1b[1m${browser.color || ""}${id.toUpperCase()}\x1b[0m`)
})
