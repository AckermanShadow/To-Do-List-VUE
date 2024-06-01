import axios from "../../service/fetch"

export default {
    namespaced: true,
    state: {
        errors: {
            // 
        },
    },
    getters: {},
    mutations: {
        // 
    },
    actions: {
        /**
         * 
         * @param  param0 
         * @return response
         */
        async findAll() {
            let response = await axios.get('/tasks');
            return response
        },

        /**
         *  Store 
         * @param {*} param0 
         * @param {*} data 
         */
        async save({ dispatch }, data) {
            dispatch
            let response = await axios.post('/tasks', data);
            return response
        },
        async delete({ dispatch }, id) {
            dispatch
            let response = await axios.delete(`/tasks/${id}`);
            return response
        },
        async update({ dispatch }, data) {
            dispatch
            let response = await axios.put(`/tasks/${data.id}`, data);
            return response
        },
    }
}