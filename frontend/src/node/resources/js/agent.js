import superagent from 'superagent';

const API_BASE = '/api';

const responseBody = (response) => response.body;

let token = null;
const setToken = (tokenParam) => {
  token = tokenParam;
};

const tokenPlugin = (request) => {
  if (token) {
    request.set('authorization', `Token ${token}`);
  }
};

const requests = {
  del: (url) => superagent.del(`${API_BASE}${url}`).use(tokenPlugin).then(responseBody),
  get: (url) => superagent.get(`${API_BASE}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) => superagent.put(`${API_BASE}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) => superagent.post(`${API_BASE}${url}`, body).use(tokenPlugin).then(responseBody),
};

const Auth = {
  current: () => requests.get('/user'),
  login: (email, password) => requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) => requests.post('/users', { user: { username, email, password } }),
  save: (user) => superagent.put('/user', { user }),
};

const Flashcards = {
  createDeck: (title, category) => requests.post('/decks', { deckData: { title, category } }),
  updateRows: (postData) => requests.post('/decks/updateRows', postData),
  getDecks: () => requests.get('/decks'),
  getDeck: (deckId) => requests.get(`/decks/${deckId}`),
};

const Api = {
  getResource: (apiLink) => requests.get(apiLink),
};

export default {
  Api,
  Auth,
  Flashcards,
  setToken,
};
