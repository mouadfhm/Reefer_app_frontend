import VuexPersist from 'vuex-persist'
import user from '../store/user'
import fonction from './fonction';

import { createStore } from 'vuex'
import vessel from './vessel';

const vuexLocalStorage = new VuexPersist({
    key: "ReeferApp",
    storage: window.localStorage,
    reducer: (state) => ({
      user: state.user,
      fonction: state.fonction,
      vessel: state.vessel
    }),
    filter: (mutation) => true,
  });
  
const Store = createStore({
    modules: {
      user: user,
      fonction: fonction,
      vessel: vessel
    },
    plugins: [vuexLocalStorage.plugin],
  })


export default Store