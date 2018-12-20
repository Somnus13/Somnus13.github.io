---
title: React+webpack4+Babel7 脚手架搭建过程（二）
date: 2018-12-20 16:44:52
categories:
    - react
tags:
    - webpack babel
---

> 第二篇主要是 react react-router react-redux

React
-----

```sh
## 安装 react && react-dom
npm i -s react react-dom
```

```js
import React from 'react';
import ReactDOM from 'react-dom';

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <div>Hello React!</div>,
  document.getElementById('root'),
);
```

运行可见 `Hello React！`

React-router
------------

```
// install react-router-dom
npm i -s react-router-dom

`cd src`
`mkdir router && touch router/router.js`

// router.js
import React from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

import Home from '../containers/Home';
import Page1 from '../containers/Counter';


const getRouter = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Counter">counter</Link></li>
      </ul>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/Counter" component={Counter} />
      </Switch>
    </div>
  </Router>
);
export default getRouter;

// 修改src/index.js
import React from 'react';
import ReactDom from 'react-dom';

import getRouter from './router/router';

ReactDom.render(
  {getRouter()}, document.getElementById('root'));
```
<!-- more -->

Home 组件：

```
// src/containers/Home/index.js
import React from 'react';

const Home = () => (
  <div>this is Home page</div>
);
export default Home;

// src/containers/Counter/index.js
// 略.
```

React-redux
-----------

```sh
// install redux and react-redux
cnpm i --save redux react-redux
```

src 文件夹下新建 store 文件夹，并创建 index.js 以及 reducer.js

```
mkdir src/store && touch src/store/index.js src/store/reducer.js

// src/store/index.js
import {
  createStore,
  applyMiddleware,
  compose,
} from 'redux';
import reduxThunk from 'redux-thunk';
import reducer from './reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(reduxThunk),
  ),
);
export default store;

// src/store/reducer.js
import { combineReducers } from 'redux';
import { reducer as countReducer } from '../containers/Counter/store';

export default combineReducers({
  counter: countReducer,
});
```

修改入口文件 index.js 以及 app.js(分离出了一个app.js,看上去河蟹一些)

```
// src/index.js
import App from './app';
...
ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

// src/app.js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import getRouter from './router/router';

const App = () => (
  <Provider store={store}>
    {getRouter()}
  </Provider>
);

export default App;
```

通过 Provider 的 store 属性把状态暴露给各个组件方便集中管理使用

接下来实现 Counter 组件

src 目录下的 container 文件夹下 新建 Counter 文件夹，并在文件下下建立如下文件：

{% asset_img 779087A16BEE88AA3496E55669A940F3.jpg %}

```sh
mkdir src/container/Counter
touch src/container/Counter/index.js
mkdir src/container/Counter/store
cd src/container/Counter/store
touch constants.js index.js action.js reducer.js
```

然后编写代码：

定义行为变量 constants ，包含三态：自增、自减以及重置

```js
// src/container/Counter/store/constants.js
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';

```

定义 reducer ，即我们触发 action 会改变 store 里的状态

```
// src/container/Counter/store/reducer.js
import { INCREMENT, DECREMENT, RESET } from './constants';

const reducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        count: state.count + 1,
      };
    case DECREMENT:
      return {
        count: state.count - 1,
      };
    case RESET:
      return { count: 0 };
    default:
      return state;
  }
};

export default reducer;

```

定义我们的 action

```js
// src/container/Counter/store/action.js
import { INCREMENT, DECREMENT, RESET } from './constants';

export const incrementAction = () => ({
  type: INCREMENT,
});

export const decrementAction = () => ({
  type: DECREMENT,
});

export const resetAction = () => ({
  type: RESET,
});

```

集体导出统一管理：(供根目录的combineReducers消费)

```js
// src/container/Counter/store/index.js
import reducer from './reducer';
import * as actionCreator from './action';
import * as constants from './constants';

export { reducer, actionCreator, constants };

```

接下来修改 Counter 组件

```
// src/container/Counter/index.js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { incrementAction, decrementAction, resetAction } from './store/action';


const Counter = (props) => {
  const {
    count,
    increment,
    decrement,
    reset,
  } = props;
  return (
    <div>
      <div>
      当前计数：
        {count}
      </div>
      <button
        type="button"
        onClick={() => increment()}
      >
        自增
      </button>
      <button
        type="button"
        onClick={() => decrement()}
      >
      自减
      </button>
      <button
        type="button"
        onClick={() => reset()}
      >
      重置
      </button>
    </div>
  );
};

Counter.propTypes = {
  count: PropTypes.number.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  count: state.counter.count,
});

const mapDispatchToProps = dispatch => ({
  increment: () => {
    dispatch(incrementAction());
  },
  decrement: () => {
    dispatch(decrementAction());
  },
  reset: () => {
    dispatch(resetAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

```

Redux-thunk
-----------

redux-thunk 使得 action 可以返回一个函数组为返回值

```js
// 创建一个json 作api请求结果
mkdir api && touch api/user.json

// user.json
{
  "name": "somnus",
  "intro": "silly b"
}
```

同理，在 container 文件夹下创建如下目录结构：

{% asset_img 19ED65FA174593DC5897E1CC9A045AF6.jpg %}

接下来是类似的代码：

```
// UserInfo/store/index.js
import reducer from './reducer';
import * as constants from './constants';
import * as action from './action';

export {
  reducer,
  constants,
  action,
};

// UserInfo/store/constants.js
export const GET_USER_INFO_REQUEST = 'GET_USER_INFO_REQUEST';
export const GET_USER_INFO_SUCCESS = 'GET_USER_INFO_SUCCESS';
export const GET_USER_INFO_FAIL = 'GET_USER_INFO_FAIL';

// UserInfo/store/action.js
import {
  GET_USER_INFO_REQUEST,
  GET_USER_INFO_SUCCESS,
  GET_USER_INFO_FAIL,
} from './constants';

const getUserInfoRequest = () => ({ type: GET_USER_INFO_REQUEST });

const getUserInfoSuccess = userInfo => ({
  type: GET_USER_INFO_SUCCESS,
  userInfo,
});

const getUserInfoFail = () => ({ type: GET_USER_INFO_FAIL });

const getUserInfo = () => (dispatch) => {
  dispatch(getUserInfoRequest());
  return fetch('/api/user.json')
    .then(res => res.json())
    .then(json => dispatch(getUserInfoSuccess(json)))
    .catch(() => dispatch(getUserInfoFail()));
};

export default getUserInfo;

// UserInfo/store/reducer.js
import { GET_USER_INFO_REQUEST, GET_USER_INFO_SUCCESS, GET_USER_INFO_FAIL } from './constants';

const initState = {
  isLoading: false,
  userInfo: {},
  errorMsg: '',
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case GET_USER_INFO_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USER_INFO_SUCCESS:
      return {
        ...state,
        isLoading: false,
        userInfo: action.userInfo,
      };
    case GET_USER_INFO_FAIL:
      return {
        isLoading: false,
        errorMsg: 'request error',
      };
    default:
      return state;
  }
};

export default reducer;

// UserInfo/index.js
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import getUserInfoAction from './store/action';

const UserInfo = (props) => {
  const {
    userinfo: { userInfo, isLoading, errorMsg },
    getUserInfo,
  } = props;
  return (
    <div>
      {isLoading
        ? '请求信息中...'
        : errorMsg || (
        <div>
          <p>用户信息</p>
          <p>
            用户名：
            {userInfo.name}
          </p>
          <p>
            介绍：
            {userInfo.intro}
          </p>
        </div>
        )}
      <button
        type="button"
        onClick={() => getUserInfo()}
      >
        请求用户信息
      </button>
    </div>
  );
};

UserInfo.propTypes = {
  userinfo: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    userInfo: PropTypes.objectOf(PropTypes.string).isRequired,
    errorMsg: PropTypes.string.isRequired,
  }).isRequired,
  getUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  userinfo: state.userinfo,
});

export default connect(
  mapStateToProps,
  dispatch => ({
    getUserInfo: () => {
      dispatch(getUserInfoAction());
    },
  }),
)(UserInfo);


// 不要忘了 在根目录下 reducer 引入
// src/store/reducer.js
import { reducer as userInfoReducer } from '../containers/UserInfo/store';

export default combineReducers({
  counter: countReducer,
  userinfo: userInfoReducer,
});
```

最后偷个图：
{% asset_img 43DE8E1521D5F265590ABE2E62C126FB.png %}

自己连抄带查，搞定了一个脚手架，记录一下。
学习就是不断做一件事1000遍以上的过程，加油。