function currentTime() {
    let date = new Date(Date.now());

    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

    return day + '.' + month + '.' + year + '--' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}
module.exports = currentTime();
