function isLink(text) {
    const textSplit = text.split(" ");
    const messageRes = [];

    textSplit.forEach((item) => {
        const expression = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)/g;
        const regex = new RegExp(expression);
        const resRegex = item.match(regex);
        if (resRegex) {
            const exp = /(http|https):\/\/([\w.]+\/?)\S*/gi;
            const reg = new RegExp(exp);
            let url = null;
            if (!resRegex[0].match(reg)) {
                url = `http://${resRegex[0]}`;
            } else {
                url = resRegex[0];
            }

            messageRes.push({
                url,
                text: item
            });
        } else {
            messageRes.push({
                text: item
            });
        }
    });
    return messageRes;
}

export default isLink