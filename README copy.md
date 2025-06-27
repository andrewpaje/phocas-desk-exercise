# Phocas Desk Layout exercise

## Background
This exercise focuses on modifying a simple application that arranges desks for a set of teams, with each person having preferences around dogs. The primary goal is to showcase your problem-solving skills by implementing a desk layout algorithm and optionally adding or modifying features in the project. There are other tasks that allow you to demonstrate your ability to work with either frontend or backend code, handle data state, and deliver clean and maintainable solutions. The application uses a React/TypeScript frontend paired with a Spring Boot Java backend.

## Tasks

You must do this task:
- [ ] implement `calculateDeskLayout` in `calculateDeskLayout.ts` (REQUIRED)

You must also do **exactly two** of the following tasks:
- [ ] fix a bug in `TeamsPage.tsx` where editing the team name fails
- [ ] implement a new feature on the Teams page that allows the removal of people from a team
- [ ] implement delete on the Teams page
- [ ] implement a visual representation of the Desk Layout instead of the current plain list (use rectangles for desks or similar)
- [ ] add backend persistence to the Desk Layout so it is not recalculated per page load
- [ ] add data validation checks to the API

You may change any of the supplied code as you see fit. Before making any changes your first commit should be the original exercise code in this zip file. Then we can use the commit history to see your changes.

## GitHub Codespaces
For this exercise we recommend using a GitHub Codespace. This removes any setup requirements from your machine. GitHub provides a free monthly quota for this tool. Remember to stop your codespace when you're not using it.

First step is to create an empty GitHub respository.

Then you can either
- unzip the exercise locally, follow the instructions in GitHub to commit the files to the repository, click the `<> Code` button, and in that popup choose `Create codespace on main`
- start the codespace, drag the zip file into the codespace's file pane (in either your browser or in Visual Studio Code), and unzip the file from the terminal within the codespace.

We do not recommend dragging the unzipped folder into the codespace as some operating systems will miss the hidden files such as `.github`, `.gitignore` and `.devcontainer`. Without the `.devcontainer` folder, codespaces will not configure correctly.

Once the exercise files are in the codespace, run:

```
pnpm i
pnpm start
```

*You may need to create a new terminal with the `+` button to the right of the terminal panel and enter*

When this starts, a toaster popup at the bottom right should appear, allowing you to open the app in a new tab.

There is also `pnpm test` to run all the unit tests and `pnpm check:fix` to run the linter.

You can rebuild the generated types with `pnpm codegen`. You will need to run this command every time you change the GraphQL queries in the app.

## Data
The application uses a local version of dynamoDB for its storage. The state will be cleared if you stop the API and delete the `backend/database` folder.

## Dev Container

If you do not wish to use Codespaces, opening the exercise in vscode should prompt with a [devcontainer](https://containers.dev/) toaster message. Accepting this will auto-configure a docker container for development.

## Manual Setup
If you would rather run this directly on your machine, you will need the following software installed.

`node`<br>
`pnpm`<br>
`java 21+`<br>
`mvn`

## Review process
Please create a Github repo that is shared with `NickiGraf`

The first commit should be the original exercise code in this zip file without any modifications so we can use the commit history to see your changes.
