# Tiny Tots Playroom

Tiny Tots Playroom is our ASU FSE100 team project. We are building four short activities that help young children practice careful hand and mouse movements. Our development proposal shows a colorful playroom with a shared screen layout for each activity.

## What works today

| Storyboard game | Current status |
| --- | --- |
| 1. Pump It Up | HUD picture only; balloon game is not built yet. |
| 2. Bubbles | HUD picture only; bubble game is not built yet. |
| 3. Feed the Dragon | Playable scooping game in Cayden's HUD preview. |
| 4. Pour It In | HUD picture only; pouring game is not built yet. |

Cayden's HUD prototype shows the activity title, Home and Sound buttons, a game area, Try Again and Next buttons, four progress dots, and a “Game X of 4” label. It uses simple p5.js shapes to suggest the storyboard's cream background, colorful toys, and rubber duck.

This is still a **separate preview**, not the finished team application. The main `index.html` and `sketch.js` still show the original gray starter canvas. The preview does not yet have the storyboard's start screen, game-selection screen, completed-game X marks, or final celebration screen. Home returns to Game 1 in the prototype. Next cycles through the four preview screens. The dots show the current screen, not completed games.

## Run the preview

Open a terminal in the project folder and start a small local web server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/cayden-hud-preview.html` in a browser. In Codespaces, open the forwarded port 8000 and add `/cayden-hud-preview.html` to its URL. The separate starter page is at `http://localhost:8000/index.html`.

A web server matters here because the game loads sound files. Opening the HTML file directly from the file manager may stop the sounds from loading. The project already includes p5.js and p5.sound in `libraries/`; there is no package installation step.

## Play Feed the Dragon

Click **Next** twice to reach Game 3. Drag the spoon's round end into the red bowl to pick up food. Then drag it gently toward the dragon's mouth and release there. You can pause and pick up the spoon again along the way. Moving too fast spills the food; letting go near the dragon but outside its mouth counts as a miss. Press **Try Again** to reset after either result. The **Sound** button turns the game's sound effects on or off.

## Where things go

| Folder or file | Purpose |
| --- | --- |
| `games/Pouring/`, `games/Balloon Pump/`, `games/Bubbles/` | Spaces for teammates' future games. |
| `games/Feed The Dragon/feedTheDragon.js` | Cayden's playable spoon and dragon game. |
| `hud/caydenHUD.js` | Cayden's shared HUD prototype and its buttons. |
| `assets/images/` and `assets/sounds/` | Pictures and short sound effects. |
| `libraries/` | The p5.js libraries already supplied with the project. |
| `cayden-hud-preview.html` | Loads the HUD, Feed the Dragon, and sound files for testing. |
| `index.html`, `sketch.js`, `style.css` | Original starter page and code. |

The current preview loads each JavaScript file with a `<script>` tag. The HUD calls `drawFeedTheDragon()` only on Game 3 and sends mouse actions to that game. This is a small example of how another game can connect. There is no automatic game loader. Coordinate with the team before editing the shared HUD or preview page.

## Working together with GitHub

Check your branch and changes before editing:

```bash
git branch --show-current
git status
```

Work on your own branch. Save only the files you meant to change with `git add`, then make a commit and push your branch for review. To get changes from GitHub while on a branch that already tracks its remote branch, run `git pull`. See [TEAM_GUIDE.md](TEAM_GUIDE.md) for a step-by-step example, including creating a branch. Ask before changing a teammate's game or a shared file, and use a pull request when your work is ready for the group to review. Do not push directly to `main`.

## Sound credits

The three WAV files in `assets/sounds/` come from [Kenney's Interface Sounds pack](https://kenney.nl/assets/interface-sounds), licensed [CC0](https://creativecommons.org/publicdomain/zero/1.0/). The [WAV copies](https://github.com/Calinou/kenney-interface-sounds) are converted from Kenney's original OGG files without changing their sound. Credit is optional under CC0, but we thank Kenney for sharing them.

| File | Used for |
| --- | --- |
| `pluck_001.wav` | Picking up food. |
| `drop_001.wav` | Spilling food or missing the mouth. |
| `confirmation_002.wav` | Feeding the dragon. |
