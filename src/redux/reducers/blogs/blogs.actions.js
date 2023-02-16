import * as types from './blogs.actionTypes'


export const getBlogData = (blogsAll) => {
    return async(dispatch) => {
        try {
            dispatch({type: types.GET_BLOGS, blogsAll:blogsAll})
        } catch (error) {
        console.log(error, "getBlogdata")   
        }
    }
}