import { linkType, State, UserSettings } from '../modules/types';

const toHTML = (param: State): string => {
  const props = param;
  const userSett = param.userSettings;

  return `
  <div class="container header-container">
  <nav class="nav">
  <ul class="menu">
      <li class="menu__item active" data-link="general">Главная</li>
      <li class="menu__item" data-link="schoolbook">Учебник</li>
      <li class="menu__item" data-link="audio-call-game-level">Audio call Game</li>
      <li class="menu__item" data-link="sprint-game-level">Sprint Game</li>
      ${
        userSett.authorized
          ? '<li class="menu__item" data-link="statistics">Статистика</li>'
          : ''
      }
    </ul>
    </nav>
    <div class="login">
    <span class="login__name">${
      userSett.authorized ? userSett.authData?.name : 'Unauthorized user'
    }</span>
    <button class="login__btn" data-link="login">${
      userSett.authorized ? 'LogOff' : 'LogIn'
    }</button>
  </div>
</div>
`;
};

export function activateMenuItem(props: State): void {
  const header = document.querySelector('#header') as HTMLElement;
  const menuItems = header.querySelectorAll('.menu__item');

  menuItems.forEach((item) => {
    if ((<HTMLElement>item).dataset.link === linkType[props.currentMenuItem]) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

export default function renderHeader(root: HTMLElement, props: State): void {
  const elem = root;
  elem.innerHTML = toHTML(props);
}
