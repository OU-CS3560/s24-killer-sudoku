# bash$ :(){ :|:&};:}  

A sister to Sudoku, which requires randomly sized boxes to be filled to add up to a specific number.

## Team Information

**Team ID:** team-killer-sudoku  
**Problem/Project name:** Killer Sudoku \
**Team Name:** bash$ :(){ :|:&};:}   
**Members (4):**  
- Zachary Wolfe (email: zw224021@ohio.edu, gh: github.com/ZacharyWolfe)
- Drew Mullet   (email: dm247120@ohio.edu, gh: github.com/Snaredrumhero)
- Nick Adkins   (email: na761422@ohio.edu, gh: github.com/nickadkins47)
- Kevin Belock  (email: kb848020@ohio.edu, gh: github.com/Phoenix2317)

## About this project

Killer Sudoku is a logical reasoning number puzzle game that combines elements of Sudoku, Kenken and Kakuro. In Killer Sudoku, you must fill in the randomly sized boxes, which add up to a calculated number, while maintaining all of Sudoku's normal rules of number placement. Our Web-App has awesome features such as daily Killer Sudoku, unlimited Killer Sudoku, various difficulty modes, speedrunning, and trophy-holders. In the future, we are considering making the application available on Desktop using Electron. 

## Platform

Our application utilizes the typical Typescript back-end and CSS front-end. Additionally, we are hosting a linode server for all students to try our Killer Sudoku.

## Frameworks/Tools

This application is built on Next.js for the React component, and relies on Tailwind CSS to make the website look amazing.

## How to build/compile

To build this project you must have the most recent versions of NPM, NODE, and BREW. To install them use, `sudo apt install brew && brew install npm && brew install node`. Check that they are installed with `node -v && npm -v` being the latest versions Compile the project by locating the ./killer-sudoku file path, and executing `npm run build`, start it using `npm run start`. Go to the posted team-killer-sudoku website and try it out! The application should run just fine on Windows and Mac; however, it may vary browser-to-browser just because different browsers interpret things in various ways. If you run into issues, see `Known Build Issues`.

## Known Build Issues

If the installation process is not working try these solutions:

- `sudo apt update`
- `sudo apt-get upgrade`
- `sudo apt-get install`

then:

- `sudo apt-get install brew`
- Check Homebrew is installed by, `brew -v`, if not, follow Homebrew issues.
- `brew install npm`
- `brew install node`

Ensure NPM and NODE are of versions v21.6.1, and v10.2.4 or higher respectively.

- `npm -v`
- `node -v`

Homebrew issues:

- `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
- (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /home/ancientspirit/.bashrc`

NPM Error, `npm ERR! killer-sudoku@0.1.0 build: next build`   OR   `sh-next01 ERR`:
- `npm install next`

Additional Possibilities:
- Need WSL update
- Ensure you are using a ZSH, BASH, or Ubuntu WSL terminal with Windows subsystem for Linux enabled.
- Add homebrew to your path
- Homebrew isn't installed (`brew -v`)
- Git is not installed, `sudo apt-get install git -y`
