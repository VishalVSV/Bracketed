var alerts = [];

var alertBox;

window.onload = function() {
    alertBox = document.getElementById("alerts");
    window.setInterval(function() {
        for (let i = 0; i < alerts.length; i++) {
            if(alerts[i].alert == null)
            {
                alertBox.appendChild(makeAlert(alerts[i]));
            }
            if(alerts[i].time > 0.1) {
                alerts[i].time -= 150 / alerts[i].time;
            }
            else {
                alerts[i].finished = true;
            }

            alerts[i].alert.style.opacity = alerts[i].time / 100;
        }

        alerts.filter(e => e.finished).forEach(e => e.alert.parentNode.removeChild(e.alert));

        alerts = alerts.filter(e => !e.finished);
    },100);
};

class Alert {
    constructor(type, text) {
        this.type = type;
        this.text = text;
        this.time = 100;
        this.finished = false;
        this.alert = null;
    }
}

function makeAlert(alert) {
    var alert_elem = document.createElement("div");
    alert_elem.classList.add(alert.type);
    alert_elem.classList.add("alert");
    alert_elem.innerText = alert.text;
    alert.alert = alert_elem;

    return alert_elem;
}

function customAlert(alert) {
    alerts.push(alert);
}