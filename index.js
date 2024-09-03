forceBreakNow = false;
forceShowInboundTime = false;
forceShowTimeTilNext = false;
forceMiliseconds = false;

//the time between each textupdate in millisecunds
defaultUpdateInterval = 200;

function getTime(targetHours, targetMinutes) {
    var today = new Date();
    var thisDay = today.getDay()
    var nextMonday = new Date();

    // Make sure the date is actually a monday
    if (thisDay != 1) {
        nextMonday.setDate(today.getDate() + (1 - thisDay + 7) % 7);
    }

    // Set the time to 17:50
    const date_future = nextMonday.setHours(targetHours,targetMinutes,0,1);

    // Calculate the time left
    let miliseconds = date_future - today;
    let seconds = Math.floor(miliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    
    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;
    miliseconds = miliseconds - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000;
    
    // Add a leading zero if the number is less than 100
    if(miliseconds < 100) { miliseconds = "0" + miliseconds;}
    if(miliseconds < 10) { miliseconds = "0" + miliseconds;}

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

    let finalMessage = "";
    let shouldAddComma = false;

    updateInterval = defaultUpdateInterval;

    //check if there is more than 1 hour til the break
    if((t.days > 0 || hours > 1) 
        && !forceShowInboundTime && !forceBreakNow || forceShowTimeTilNext) //check debug variables
    {
        clockText.innerHTML = breakIsLongInboundMessage;
        t = getTime(17, 0);

        if(forceMiliseconds)
        {
            finalMessage = finalMessage + numberContainerText + t.miliseconds + numberContainerTextEnd+ " " + millisecondsMessage
            shouldAddComma = true;
            updateInterval = 0;
        }
    
        if(t.seconds != 0)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.seconds + numberContainerTextEnd + " " + secondsMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    
        if(t.minutes != 0)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.minutes + numberContainerTextEnd + " " + minutesMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    
        if(t.hours != 0)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.hours + numberContainerTextEnd + " " + hoursMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    
        if(t.days != 0)
        {
            let addComma = ""
            if (shouldAddComma) {addComma = ", <br>"}
            finalMessage = numberContainerText + t.days + numberContainerTextEnd + " " + daysMessage + addComma + finalMessage;
            shouldAddComma = true;
        }
    }
    //check if it's less than 10 minutes since the break started. display breakMessage if true
    else if (t.hours == 23 && t.days == -1 && t.minutes > 49
         && !forceShowTimeTilNext && !forceShowInboundTime || forceBreakNow) //check debug variables
    {
        clockText.innerHTML = breakMessage;
    }
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
        
        if(t.minutes < 10) {t.minutes = "0" + t.minutes}
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