// Project using EJS and MongoDB 
// Udemy Course: The Complete 2023 Web Developement Bootcamp
// Acknowledgement: Angela Yu (App Brewery)
// By: sys-unknwn7645

exports.getDate = function getDate() {
    let today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }
    return day = today.toLocaleString("en-US", options);
};

exports.getDay = function getDay() {
    let today = new Date();
    const options = {
        weekday: "long",
    }
    return day = today.toLocaleString("en-US", options);
};