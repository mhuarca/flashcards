create table users (
    id varchar(255) primary key,
    username varchar(255) UNIQUE,
    email varchar(255) UNIQUE,
    password varchar(255) NOT NULL,
);

create table decks (
    id int primary key,
    userId varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    category varchar(100) NOT NULL,
    foreign key (userId) references users(id)
);

create table cards (
    id int auto_increment primary key,
    deckId int,
    orderColumn int auto_increment,
    question varchar(2000) NOT NULL,
    answer varchar(2000) NOT NULL,
    foreign key (deckId) references decks(id)
);

INSERT INTO users VALUES('GUEST', 'GUEST', 'GUEST', 'na');

INSERT INTO decks VALUES(101, 'GUEST', 'Bean Scopes in Spring', 'Programming');
INSERT INTO cards (deckId, question, answer) VALUES(101, 'Which bean scopes are supported by Spring?', 'Singleton, Prototype, Request, Session, and Global-Session. The Request, Session, and Global Session scopes are only valid in an ApplicationContext.');
INSERT INTO cards (deckId, question, answer) VALUES(101, 'What is the default bean scope in Spring?', 'The default bean scope in Spring is Singleton.');
INSERT INTO cards (deckId, question, answer) VALUES(101, 'When should you use a singleton scoped bean vs. a prototype scoped bean (non-singleton)?', 'You should use the singleton scope for stateless beans, and the prototype scope for stateful beans.');
INSERT INTO cards (deckId, question, answer) VALUES(101, 'How can you enable support for Request, Session, and Global-Session bean scope outside of Spring Web MVC?', 'If you are not using Spring Web MVC, you can enable the extra scopes by using either "RequestContextListener" or "RequestContextFilter".');
INSERT INTO cards (deckId, question, answer) VALUES(101, 'When should you use "global-session" scope vs. "session" scope?', 'The "global-session" scope is to be used by portlet-based applications since the portlet specification defines the concept of a global session.');

INSERT INTO decks VALUES(102, 'GUEST', 'React Hooks', 'Programming');
INSERT INTO cards (deckId, question, answer) VALUES(102, 'What version of React supports hooks?', 'To support hooks, all React packages need to be 16.8.0 or higher.');
INSERT INTO cards (deckId, question, answer) VALUES(102, 'What are the equivalent hooks for the following lifecycle methods: componentDidMount, componentDidUpdate, componentWillUnmount?:', 'The useEffect Hook can be used to replace each of those lifecycle methods.');
INSERT INTO cards (deckId, question, answer) VALUES(102, 'Do hooks provide anything like instance variables?', 'The "useRef" hook provides behavior like an instance variable. To prevent unexpected behavior, only mutate the "ref" object in event handlers and effects.');
INSERT INTO cards (deckId, question, answer) VALUES(102, 'Do hooks provide a way to memoize expensive render calculations?', 'Yes, you can use the "useMemo" hook  which can be configured with dependencies to provide memoization.');
INSERT INTO cards (deckId, question, answer) VALUES(102, 'Are hooks allowed inside loops, conditions, or nested functions?', 'No, hooks must be called at the top level of the React function. This ensures hooks are called in the same order each time a component renders.');

