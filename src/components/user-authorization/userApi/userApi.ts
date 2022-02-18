import {
  headersAddType,
  idNameEmailPasswordType,
  localStorageCurrentUserObject,
  requestOptionsType,
  urlType,
} from '../../utilites/types';
import { urlSignIn, urlUsers } from '../../utilites/consts';
import { Auth, State } from '../../../modules/types';

export default class User {
  static getRequest(
    headersAdds: headersAddType[],
    requestOptions: requestOptionsType,
    url: urlType,
    id?: string
  ) {
    const myHeaders = new Headers();
    headersAdds.forEach((header) => {
      myHeaders.append(header.name, header.value);
    });
    const resultId = id ? id.padStart(id.length + 1, '/') : '';
    fetch(`${url}${resultId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }

  static getUser(id: string, token: string) {
    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    return fetch(`${urlUsers}/${id}`, requestOptions);
  }

  static updateToken(userId: string, tokenReset: string): Promise<Auth> {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${tokenReset}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    return fetch(`${urlUsers}/${userId}/tokens`, requestOptions).then(
      (response) => response.json()
    );
  }

  static checkAuthorization(state: State) {
    User.getUser(
      (<Auth>state.userSettings.authData).userId,
      (<Auth>state.userSettings.authData).token
    )
      .then((response) => {
        switch (response.status) {
          case 401:
            User.updateToken(
              (<Auth>state.userSettings.authData).userId,
              (<Auth>state.userSettings.authData).refreshToken
            ).then((result) => {
              state.userSettings.authData = result;
            });
            break;
          case 404:
            delete state.userSettings.authData;
            break;
        }
      })
      .catch((error) => console.log(error));
  }

  static createUser(
    value: idNameEmailPasswordType
  ): Promise<Response> {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(value);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    return fetch(urlUsers, requestOptions);
  }

  static signIn(value: idNameEmailPasswordType) {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      email: value.email,
      password: value.password,
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    return fetch(urlSignIn, requestOptions);
  }

  // static signUpAndLogIn(value: idNameEmailPasswordType) {
  //   User.createUser(value)
  //     .then((response) => response.json())
  //     .then((value: idNameEmailPasswordType) => {
  //       console.log(value)
  //       User.signIn(value);
  //     })
  //     .catch((error) => console.log(error));
  // }

  // signUp() {
  //   const value = this.returnObjectWithInfoFromInput();
  //   console.log(value);
  //   this.createUser(value);
  // }
  //
  // logIn() {
  //   const value = this.returnObjectWithInfoFromInput();
  //   this.signIn(value).then((result) => {
  //     localStorage.setItem('currentUser', <string>result);
  //   });
  // }
  static deleteUser(requestObject: localStorageCurrentUserObject) {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${requestObject.token}`);

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${urlUsers}/${requestObject.userId}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }
}
