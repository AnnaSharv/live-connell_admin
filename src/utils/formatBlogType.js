import parse from 'html-react-parser';

export function formatBlogType(type) {
    let list = ''
    if(type[0]) list +=  "<div style={'fontWeight:bold'}>" + type[0] + "</div>"
    if(type[1]) list +=  "<div>" + type[1] + "</div>"
    if(type[2]) list +=  "<div>" + type[2] + "</div>"
    if(type[3]) list +=  "<div>" + type[3] + "</div>"
    return parse(list)
}

