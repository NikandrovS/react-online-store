function parseDate (orderData, options) {
    let date = new Date(orderData);
    let today = (new Date(Date.now())).getDate();

    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let weekDay = " ";
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (options) {
        weekDay = date.getDay();
        switch (weekDay) {
            case 0:
                weekDay = "Воскресенье";
                break
            case 1:
                weekDay = "Понедельник";
                break
            case 2:
                weekDay = "Вторник";
                break
            case 3:
                weekDay = "Среда";
                break
            case 4:
                weekDay = "Четверг";
                break
            case 5:
                weekDay = "Пятница";
                break
            case 6:
                weekDay = "Суббота";
                break
        }
    }

    switch (month) {
        case 1:
            month = "Января";
            break
        case 2:
            month = "Февраля";
            break
        case 3:
            month = "Марта";
            break
        case 4:
            month = "Апреля";
            break
        case 5:
            month = "Мая";
            break
        case 6:
            month = "Июня";
            break
        case 7:
            month = "Июля";
            break
        case 8:
            month = "Августа";
            break
        case 9:
            month = "Сентября";
            break
        case 10:
            month = "Октября";
            break
        case 11:
            month = "Ноября";
            break
        case 12:
            month = "Декабря";
            break
    }

    if (day === today) {
        return ['Сегодня' + ' ' + hours + ':' + minutes.substr(-2) + ' ' + weekDay]
    } else if (day === today-1) {
        return ['Вчера' + ' ' + hours + ':' + minutes.substr(-2) + ' ' + weekDay]
    } else {
        return [day + ' ' + month  + ' ' + year + ' ' + hours + ':' + minutes.substr(-2) + ' ' + weekDay]
    }
}


export default parseDate