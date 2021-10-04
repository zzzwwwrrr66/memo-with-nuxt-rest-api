import axios from 'axios'

export const state = () => ({
  memo: [],
})

export const mutations = {
  setMemo(state, data) {
    state.memo = data;
  }
}

export const actions = {
  async CREATE_MEMO(context, data) {
    const res = await axios.post('http://localhost:3001/memo', {
      ...data
    });

    return res;
  },
  async READ_MEMO(context, data) {
    const res = await axios.get('http://localhost:3001/memo');
    context.commit('setMemo', res.data);
  },
  async DELETE_MEMO(context, id) {
    const res = await axios.delete(`http://localhost:3001/memo/${id}`);
    return res;
  },
  async UPDATE_MEMO(context, data) {
    const res = await axios.patch(`http://localhost:3001/memo/${data.id}`, {
      ...data
    });
    return res;
  },
}