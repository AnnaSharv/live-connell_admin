import * as types from './blogs.actionTypes'



const initialState = {
    blogsAll: []
}

const blogReducer = (state = initialState, action) => {
    if(types.GET_BLOGS) {
        return {
            ...state,
            blogsAll:  action.blogsAll
        }
    } else {
        console.log(action,"catch")
        return state
    }

   
}


export default blogReducer