
function ab () {

    require("./second")
        .then(s => console.log('hit a', s.test));


};
ab();