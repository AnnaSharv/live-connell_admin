import { parseISO, format as formatISO } from "date-fns/esm";


function formatDate(d) {
    //d format is '2023-03-02'
    const isoDate = d;
    const date = parseISO(isoDate);
    const formattedDate = formatISO(date, "dd MMM, yyyy");
    return formattedDate
}

export default formatDate