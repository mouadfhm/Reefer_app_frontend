import VuexPersist from 'vuex-persist'
import user from '../store/user'
import fonction from './fonction';

import { createStore } from 'vuex'
import vessel from './vessel';
import load from './load';
import reefer from './reefer';
import issueType from './issueType';
import actionHistory from './actionHistory';
import issue from './issue';
import discharge from './discharge';
import houseKeeping from './houseKeeping';
import gate from './gate';

const vuexLocalStorage = new VuexPersist({
    key: "ReeferApp",
    storage: window.localStorage,
    reducer: (state) => ({
      user: state.user,
      fonction: state.fonction,
      vessel: state.vessel,
      load: state.load,
      reefer: state.reefer,
      issueType: state.issueType,
      actionHistory: state.actionHistory,
      issue: state.issue  ,
      discharge: state.discharge,
      houseKeeping: state.houseKeeping,
      gate: state.gate
    }),
    filter: (mutation) => true,
  });
  
const Store = createStore({
    modules: {
      user: user,
      fonction: fonction,
      vessel: vessel,
      load: load,
      reefer: reefer,
      issueType: issueType,
      actionHistory: actionHistory,
      issue: issue,
      discharge: discharge,
      houseKeeping: houseKeeping,
      gate: gate
    },
    plugins: [vuexLocalStorage.plugin],
  })


export default Store