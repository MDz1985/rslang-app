import {
  CurrentPage,
  linkType,
  RenderPage,
  State,
  UserSettings,
} from '../modules/types';
import renderFooter from './footer';
import renderHeader, { activateMenuItem } from './header';

import UserAuthorization from './user-authorization/user-authorization';
import Game from "./audio-challenge-game/game-class";

const toHTML = (): string => {
  return `
  <header class="header" id="header">
  </header>
  <main class="main" id="main">
  </main>
  <footer class="footer" id="footer">
  </footer>  
  `;
};

function setPageState(props: UserSettings) {
  activateMenuItem(props);
}

function addEventsForApp(param: State): void {
  const userAuthInstance = new UserAuthorization(param);
  const userAuthorizationElement = userAuthInstance.readyElement;
  const gameInstance = new Game(param);

  const props = param.userSettings;
  const app = document.getElementById('app') as HTMLElement;
  const main = document.getElementById('main') as HTMLElement;

  document.body.addEventListener('click', async (e) => {
    if (e.target) {
      const linkName = (<HTMLElement>e.target).dataset.link;
      const currentTarget = e.currentTarget as HTMLElement;

      if (linkName) {
        switch (linkName) {
          case linkType.general:
            props.currentPage = CurrentPage.general;
            break;
          case linkType.aboutApp:
            props.currentPage = CurrentPage.aboutApp;
            break;
          case linkType.schoolbook:
            props.currentPage = CurrentPage.schoolbook;
            props.schoolbookCurrentPosition.chapter = 0;
            break;
          case linkType.audioCallGame:
            props.currentPage = CurrentPage.audioCallGame;
            gameInstance.getDataForGame();
            break;
          case linkType.sprintGame:
            props.currentPage = CurrentPage.sprintGame;
            break;
          case linkType.statistics:
            props.currentPage = CurrentPage.statistics;
            break;
          case linkType.developmentTeam:
            props.currentPage = CurrentPage.developmentTeam;
            break;
          case linkType.login:
            if (!props.authorized) {
              currentTarget.append(userAuthorizationElement);
            } else {
              props.authorized = false;
              delete props.authData;
              renderHeader(app.querySelector('#header') as HTMLElement, props);
            }
            break;
          default:
            break;
        }
        RenderPage[props.currentPage](main, param);
        activateMenuItem(props);
      }
    }
  });
}

export default function renderApp(root: HTMLElement, props: State): void {
  const rootElem = root;
  rootElem.innerHTML = toHTML();

  renderHeader(
    rootElem.querySelector('#header') as HTMLElement,
    props.userSettings
  );
  RenderPage[(<UserSettings>props.userSettings).currentPage](
    rootElem.querySelector('#main') as HTMLElement,
    props
  );
  renderFooter(rootElem.querySelector('#footer') as HTMLElement);

  setPageState(props.userSettings);
  addEventsForApp(props);
}
