# DominoPivot's OBR extensions

This repository holds extensions created by DominoPivot for the [Owlbear Rodeo](https://www.owlbear.rodeo/) virtual tabletop. These were made with the help of the [Owlbear Rodeo SDK](https://github.com/owlbear-rodeo/sdk), used under [MIT license](https://raw.githubusercontent.com/owlbear-rodeo/sdk/main/LICENSE).

DominoPivot's OBR extensions are hosted via Github Pages, and can be installed in an Owlbear Rodeo room by copying the URL of their manifest file, which usually has this format:

`https://obrx.dominopivot.com/extension_name/manifest.json`

Once an extension is added and enabled in a room, its code will be fetched and executed on the browsers of all players who visit the room. You should inform your players before adding third party extensions to the game.

## For developers

The `latest` branch should hold the source code of the live version, whose transpiled output can be found on the `gh-pages` branch. Other branches can be considered work-in-progress.

At time of writing, this project is built by running `scripts` in Node.js v22.9.0 on Windows, with dependencies managed with `npm`. The build scripts may rely on experimental file system APIs, so your mileage may vary if you use a different Node version or operating system.

-   `npm install` fetches external dependencies.
-   `npm run build` builds the distribution version.
-   `npm run clean` removes any leftover files from previous builds.
-   `npm run watch` runs a local test server and rebuilds on file changes.

## Licensing

At the moment, reproduction of this repository is only allowed for personal use. The code will likely be released under an open license at a later date. (If the last commit on this README file is ancient, open an issue to remind me.)

<small>

This software is provided as is, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.

</small>
