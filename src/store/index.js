import VuexPersist from 'vuex-persist'
import user from '../store/user'
import fonction from './fonction';

import { createStore } from 'vuex'
import vessel from './vessel';
import load from './load';

const vuexLocalStorage = new VuexPersist({
    key: "ReeferApp",
    storage: window.localStorage,
    reducer: (state) => ({
      user: state.user,
      fonction: state.fonction,
      vessel: state.vessel,
      load: state.load
    }),
    filter: (mutation) => true,
  });
  
const Store = createStore({
    modules: {
      user: user,
      fonction: fonction,
      vessel: vessel,
      load: load
    },
    plugins: [vuexLocalStorage.plugin],
  })


export default Store