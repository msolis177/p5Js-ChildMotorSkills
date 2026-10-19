# Tiny Tots Playroom team guide

This guide is for anyone adding a game to our FSE100 project. You do not need to know every part of p5.js or Git before starting. Make a small change, run the preview, and check which files changed before saving your work.

To inspect Cayden's preview on GitHub, [open the HUD preview file on the `cayden-development` branch](https://github.com/msolis177/p5Js-ChildMotorSkills/blob/cayden-development/cayden-hud-preview.html). To read or download its source, open [the full `cayden-development` branch](https://github.com/msolis177/p5Js-ChildMotorSkills/tree/cayden-development). This branch. is in the [team repository](https://github.com/msolis177/p5Js-ChildMotorSkills), and it is not a change to the team's `main` branch.

## A. Getting started

1. Open [the team repository's `cayden-development` branch](https://github.com/msolis177/p5Js-ChildMotorSkills/tree/cayden-development) if you want the working HUD and dragon game. Choose **Code** to open a Codespace or copy the repository URL to clone it in VS Code. The team repository's `main` branch does not yet contain this prototype.
2. In VS Code, open the `p5Js-ChildMotorSkills` folder. The Explorer panel on the left shows the files and folders.
3. Open a terminal in that folder. In VS Code, use **Terminal → New Terminal**. Run `git branch --show-current` and `git status` so you know which branch you are using and whether you have changes already.
4. Start the preview with `python3 -m http.server 8000`. Visit `http://localhost:8000/cayden-hud-preview.html`. In Codespaces, use the forwarded port 8000 link and add `/cayden-hud-preview.html` to the end. The GitHub preview-file link above lets you inspect the source, but run it through the local or Codespaces web server to play it.
5. Click **Next** to see the four activity screens. Feed the Dragon is Game 3. The other three game pictures are previews, not finished activities.

The `games/` folder has one folder per activity. `hud/` holds Cayden's shared interface prototype. `assets/` holds pictures and sounds. `libraries/` contains p5.js and p5.sound. The main `index.html` and `sketch.js` are still the original starter page; `cayden-hud-preview.html` is the working game preview.

## B. Working on your game

1. Check with the team which game you own, then create a JavaScript file inside that game's folder. For example, the pouring student could create `games/Pouring/pouring.js`.
2. Start with a small function that draws your game. In p5.js, functions such as `circle()`, `rect()`, `fill()`, and `text()` draw on the canvas:

   ```javascript
   function drawPouring() {
     fill("blue");
     circle(480, 300, 50);
   }
   ```

3. The preview already has one `setup()` and one `draw()` in `hud/caydenHUD.js`. `setup()` creates the canvas once. `draw()` redraws the screen many times each second. Do not add another global `setup()` or `draw()` in your game file: one would replace the other. Give your functions game-specific names such as `drawPouring()` or `pouringMousePressed()`.
4. In `cayden-hud-preview.html`, add a `<script>` tag for your file before the HUD script. Then, in `drawGamePlaceholder()` in `hud/caydenHUD.js`, call your drawing function for your activity's game number. If your game needs clicks or drags, pass them along from the HUD's `mousePressed()`, `mouseDragged()`, and `mouseReleased()` functions, the way Feed the Dragon does. Agree on these shared-file edits with the team first.
5. Test your own screen after every small change. Open the browser's developer console if the screen is blank; an error there often points to a missing file or a misspelled function name.

The preview currently has no general game API. The `hudGames` list supplies titles, colors, and placeholder notes; the HUD's own code draws progress dots and chooses which game function to call. A new game can keep its instructions, progress, success or failure, and restart function in its own file. Connect only the few functions the HUD needs.

## C. Saving your work

These commands run in the project's terminal. Replace `your-name-game` and the example file path with your own names.

1. Start from the latest `main` and make a branch for your work:

   ```bash
   git switch main
   git pull origin main
   git switch -c your-name-game
   ```

   If `git status` shows changes before switching branches, stop and ask for help so you do not lose or mix work.

2. Check what you changed: `git status`. Add only the files you meant to change. For example:

   ```bash
   git add -- games/Pouring/pouring.js
   git status
   ```

3. Save a local snapshot with a message that says what you did:

   ```bash
   git commit -m "Start pouring game"
   ```

4. Share your branch on GitHub:

   ```bash
   git push -u origin your-name-game
   ```

`git add` chooses files for the next commit. `git commit` saves those chosen files locally. `git push` sends your branch to GitHub. After your branch is published, `git pull` gets changes from its matching GitHub branch. Always run `git status` and check the branch name before a push. A push to your branch does not merge it into `main`.

## D. Working together

- Keep each activity's work in its own folder when possible. Ask teammates before editing `hud/caydenHUD.js`, `cayden-hud-preview.html`, or another person's game.
- Share the link to your branch so teammates can look at it. When the group is ready, open a pull request from your branch into `main` and ask the team to review it. Do not merge it without the group's agreement.
- Pull the latest changes before starting new work on a shared file. Make small commits so it is easy to see what changed.
- If Git reports a merge conflict, do not guess which version to keep. Open the marked file, compare both versions with the teammate who also edited it, remove the conflict markers, run the preview again, then commit the resolved file. Ask for help if the conflict is in a shared HUD file.

## E. How Cayden's HUD and dragon game work

The HUD's `setup()` creates a 960 × 640 canvas. Its `draw()` calls functions that draw the background, toy decorations, header, center game area, footer, and cursor. `drawHudButton()` draws each rounded button. `mousePressed()` checks whether the mouse is inside each button's rectangle using `isInsideHudButton()`.

`hudCurrentGame` is the selected screen number, starting at 0. `hudGames` stores the four titles. The footer draws four dots, and the dot matching `hudCurrentGame` is filled. It displays `hudCurrentGame + 1` so children see “Game 1 of 4” instead of “Game 0 of 4.” Next changes the selected screen. Home returns to Game 1 in this prototype. The Sound button changes `hudSoundOn`.

On Game 3, the HUD calls `drawFeedTheDragon()`. It also sends mouse actions to `feedDragonMousePressed()`, `feedDragonMouseDragged()`, and `feedDragonMouseReleased()`. `spoonX` and `spoonY` are the spoon's position. When the child presses near the spoon, `spoonDragging` becomes true. While the mouse moves, the spoon follows it.

The spoon picks up food when its round end enters the bowl's area. The code checks whether the spoon is less than 73 canvas pixels from the bowl center and sets `spoonHasFood` to true. The spoon then shows food on it, gives a short pluck sound, and asks the child to move slowly.

To measure speed, `feedDragonMouseDragged()` compares the spoon's new and old positions with `dist()`, then divides that distance by the time between mouse movements. The result is roughly pixels per second. Once the food leaves the bowl, a speed over `safeSpoonSpeed` (currently 1400) spills it. The game shows a failure message and plays a gentle drop sound if Sound is on.

When the child releases the spoon, `feedDragonMouseReleased()` checks whether it has food and is close enough to the dragon's mouth. A release within 39 canvas pixels of the mouth succeeds and plays the confirmation sound. Releasing near the dragon but away from the mouth is a miss. The child may pause and re-grab the spoon earlier along the path. `resetFeedTheDragon()` puts the spoon back at its starting position, clears the food and result, and restores the first instruction. The HUD's Try Again button calls that function on Game 3.

All of this is a prototype. The storyboard's game-selection menu, completed-game marks, and end celebration still need to be connected by the team.

To make one combined app later, the team can review each student's branch, agree on any shared HUD changes, load each game file in the main page, and connect its drawing, mouse, and restart functions as described in Section B. Test all four games together before merging. Nothing in Cayden's fork automatically changes the team repository.
