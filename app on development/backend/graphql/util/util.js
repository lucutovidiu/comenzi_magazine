const monthNames = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
];

function GetFormatedDateDDMMMYYYYhhmm(date) {
    // console.log(new Date(date).getDate())
    let day = parseInt(new Date(date).getDate());
    let thhreeletmonth = monthNames[parseInt(new Date(date).getMonth())].substring(0, 3);
    let year = new Date(date).getFullYear();
    let hh = new Date(date).getHours();
    let mm = new Date(date).getMinutes();
    return day + "-" + thhreeletmonth + "-" + year + " " + hh + ":" + mm;
}
function GetFormatedDateYYYYMMDD(date) {
    // console.log(new Date(date).getDate())
    let day = parseInt(new Date(date).getDate());
    let month = parseInt(new Date(date).getMonth()) + 1;
    let year = new Date(date).getFullYear();
    return year + "-" + month + "-" + day;
}
function YYYYMMDDhhmmss(date) {
    // console.log(new Date(date).getDate())
    let day = parseInt(new Date(date).getDate());
    let month = parseInt(new Date(date).getMonth()) + 1;
    let year = new Date(date).getFullYear();
    let hh = new Date(date).getHours();
    let mm = new Date(date).getMinutes();
    let ss = new Date(date).getSeconds();
    return year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
}

function SubstractMonthBeginingOfMonthYYYYMMDD(date, nrOfMonths) {
    // console.log(new Date(date).getMonth)
    date = new Date(date).setMonth(parseInt(new Date(date).getMonth() + 1) - nrOfMonths);
    let day = 1;
    let month = parseInt(new Date(date).getMonth());
    let year = new Date(date).getFullYear();
    return year + "-" + month + "-" + day;
}

module.exports = {
    GetFormatedDateDDMMMYYYYhhmm,
    SubstractMonthBeginingOfMonthYYYYMMDD,
    GetFormatedDateYYYYMMDD,
    YYYYMMDDhhmmss
}