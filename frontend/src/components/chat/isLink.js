export function isLink(text) {
    //
    const expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    let result = ''
    let restText = text
    const res = text.match(regex)
    if (res) {
        res.forEach((link) => {
            // const testLink = link.split('.')
            // if (testLink[1] == '' || testLink[1].charAt(0) === testLink[1].charAt(0).toUpperCase()) {
            //     return link
            // }


            const exp = /(http|https):\/\/([\w.]+\/?)\S*/ig
            const reg = new RegExp(exp);

            let url = null
            if (!link.match(reg)) {
                url = `http://${link}`
            } else {
                url = link
            }
            const temp = restText.replace(link, `<a target='_blank' href='${url}'>$&</a>`).split('</a>')
            result += temp[0] + '</a>'
            restText = temp[1]
        });
        return result + restText
    } else {
        return text
    }
}