# ClipTale

This is a desktop app made in electron to track and manage your clipboard history.

### Stack

-   [Electron.js](https://www.electronjs.org/)
-   [React](https://reactjs.org/)
-   [TailwindCSS](https://tailwindcss.com/)
-   [Typescript](http://typescriptlang.org/)

### Run the app locally

-   Clone the repository

```
git clone https://github.com/FourLineCode/cliptale.git
```

-   Install dependencies

```
yarn
```

-   Run the app

```
yarn start
```

##### Build executable / installable

-   Executable

```
yarn package
```

-   Installable

```
yarn make
```

#### ToDo's

-   [x] change brand color
-   [x] focus on open/close
-   [x] add tooltip to buttons
-   [x] clear history
-   [x] search filter
-   [x] delete from history
-   [x] show length
-   [x] show total items
-   [x] arrow key navigate
    -   [x] up/down = navigate
        -   [x] esc = unselect
    -   [x] ctrl+c / enter = copy
    -   [x] delete / backspace = remove
    -   [x] alt+`num` = focus num indexed
    -   [x] ctrl+k = focus search
        -   [x] esc to blur search
    -   [x] scroll to selected item
    -   [ ] ctrl+z undo delete maybe???
-   [x] material redesign
-   [ ] show appname in context menu
-   [ ] show all keybinds
-   [ ] setting page
-   [ ] max number of history
-   [ ] show image copy history
-   [ ] dark mode
-   [ ] store history in db
-   [ ] favourite clips
-   [ ] add app icon
-   [ ] build for distribute
