forceBreakNow = false;
forceShowInboundTime = false;
forceShowTimeTilNext = false;
forceMiliseconds = false;

datePhusher = 1000*60*60*-13.7

//the time between each textupdate in millisecunds
defaultUpdateInterval = 100;

function getTime(targetHours, targetMinutes) {
    var today = new Date();
    if(datePhusher != 0) {today.setTime(today.getTime()+datePhusher)}
    console.log(today)
    var thisDay = today.getDay()
    //console.log("day of the week: "+thisDay)
    var nextMonday = new Date();
    // set date to next monday
    nextMonday.setDate(today.getDate() + (1 - thisDay + 7) % 7);

    //console.log("next monday: "+nextMonday)

    // Set the time to 17:50
    const date_future = nextMonday.setHours(targetHours,targetMinutes,0,1);

    // Calculate the time left
    let miliseconds = date_future - today;
    //console.log("mil: "+miliseconds)
    let seconds = Math.floor(miliseconds / 1000);
    //console.log("sec: "+seconds)
    let minutes = Math.floor(seconds / 60);
    //console.log("min: "+minutes)
    let hours = Math.floor(minutes / 60);
    //console.log("hou: "+hours)
    let days = Math.floor(hours / 24);
    //console.log("day: "+days)
    
    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
    miliseconds = miliseconds - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000;
    
    // Add a leading zero if the number is less than 100 and 10
    if(miliseconds < 100) { miliseconds = "0" + miliseconds;}
    if(miliseconds < 10) { miliseconds = "0" + miliseconds;}

    if(days == -1) {days = 6}

    //console.log(seconds)

    return {
        miliseconds: miliseconds,
        seconds: seconds,
        minutes: minutes,
        hours: hours,
        days: days
    };
}

function isEven(n) {
    return n % 2 == 0;
 }
 
 function isOdd(n) {
    return Math.abs(n % 2) == 1;
 }

daysMessage = "dage"
hoursMessage = "timer"
minutesMessage = "minutter"
secondsMessage = "sekunder"
millisecondsMessage = "millisekunder"

breakIsLongInboundMessage = "der er først coding pirates igen om:"
breakIsInboundMessage = "der er pause om:"
breakIsOverMessage = "pausen er ovre nu..."
breakMessage = "nu er der pause!"

numberContainerText = "<span class=\"clockNumber\">"
blinkContainerText = "<span class=\"blink\">"
numberContainerTextEnd = "</span>"

function updateTime() {
    // Get the time left
    let t = getTime(17, 50);

    console.log("test1 d:"+t.days+" h:"+t.hours+" m:"+t.minutes+" s"+t.seconds);
    let finalMessage = "";
    let shouldAddComma = false;
    
    updateInterval = defaultUpdateInterval;
    
    //check if there is more than 1 hour til the break
    if (t.days == 6 && t.hours == 23 && t.minutes >= 50
         && !forceShowTimeTilNext && !forceShowInboundTime || forceBreakNow) //check debug variables
    {
        clockText.innerHTML = breakMessage;
    }
    else if (t.days == 6 && (t.hours >= 22 && (t.hours == 22 ? t.minutes >= 50 : t.minutes < 50))
        && !forceShowTimeTilNext && !forceShowInboundTime || forceBreakNow) //check debug variables
    {
        clockText.innerHTML = breakIsOverMessage;
    }
    else if((t.days > 0 || t.hours >= 1 || t.minutes >= 50)
        && !forceShowInboundTime && !forceBreakNow || forceShowTimeTilNext) //check debug variables
    {
        t = getTime(17, 0);
        let milisecondsAreReal = t.miliseconds != 0;
        let secondsAreReal = t.seconds != 0;
        let minutesAreReal = t.minutes != 0;
        let hoursAreReal = t.hours != 0;
        let daysAreReal = t.days != 0;
        if(milisecondsAreReal || secondsAreReal || minutesAreReal || hoursAreReal || daysAreReal) clockText.innerHTML = breakIsLongInboundMessage;

        if((milisecondsAreReal && (!daysAreReal && !hoursAreReal && !minutesAreReal && t.seconds < 10)) || forceMiliseconds)
        {
            finalMessage = finalMessage + numberContainerText + t.seconds + "." + t.miliseconds + " " + secondsMessage + numberContainerTextEnd
            shouldAddComma = true;
            updateInterval = 0;
        }
    
        if((minutesAreReal || hoursAreReal || daysAreReal) ? secondsAreReal : t.seconds >= 10)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.seconds + numberContainerTextEnd + " " + secondsMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    
        if(minutesAreReal)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.minutes + numberContainerTextEnd + " " + minutesMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    
        if(hoursAreReal)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.hours + numberContainerTextEnd + " " + hoursMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    
        if(daysAreReal)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.days + numberContainerTextEnd + " " + daysMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    }
    //check if it's less than 10 minutes since the break started. display breakMessage if true
    //check if theres less than an hour til the break
    else if(t.hours <= 1 
        || forceShowInboundTime) //check debug variables
    {
        
        clockText.innerHTML = breakIsInboundMessage;
        if(forceMiliseconds || (t.seconds < 10 && t.minutes == 0 && t.hours == 0 && t.days == 0))
        {
            finalMessage = finalMessage + numberContainerText + t.miliseconds + numberContainerTextEnd
            shouldAddComma = true;
            updateInterval = 0;
        }
        
        if(t.seconds < 10) {t.seconds = "0" + t.seconds}
        let addComma = ""
        if (shouldAddComma) {addComma = "."}
        finalMessage = numberContainerText + t.seconds + numberContainerTextEnd + addComma + finalMessage;
        shouldAddComma = true;

        let showBlink = isEven(t.seconds)
        let blinkMessage = ":"
        if(!showBlink) {blinkMessage = " "}
        
        finalMessage = numberContainerText + t.minutes + numberContainerTextEnd + blinkContainerText + blinkMessage + numberContainerTextEnd + finalMessage;
        shouldAddComma = true;

        if(t.hours != 0)
        {
            finalMessage = numberContainerText + t.hours + numberContainerTextEnd + blinkContainerText + blinkMessage + numberContainerTextEnd + finalMessage;
            shouldAddComma = true;
        }
    }

    //console.log(finalMessage)
    clockContainer.innerHTML = finalMessage;
    setTimeout(updateTime, updateInterval);
}

clockText = document.getElementsByClassName("clockText")[0]

clockHeader = document.getElementById("clockHeader");
clockContainer = document.getElementById("nextTimeClock");

updateTime()