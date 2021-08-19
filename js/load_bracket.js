
function get_sheets_req(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/'BracketedData'!A1:Z?key=AIzaSyBzju6OEbSXAah79LidRQVbzWJFxT0rXjc&majorDimension=COLUMNS`;
}

function get_sheets_data(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}?key=AIzaSyBzju6OEbSXAah79LidRQVbzWJFxT0rXjc`;
}

var bracket = null;

var warned = false;

function load_bracket(sheet_id) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if(xmlHttp.status == 200) {
                var local_bracket = new Bracket();
                var res = JSON.parse(xmlHttp.responseText);
                if(res.values[0][0].trim().toLowerCase() == "ok") {
                    for (let i = 0; i < res.values.length; i++) {
                        const element = res.values[i];
                        var round = new Round(element[1], element.slice(2));
                        local_bracket.rounds.push(round);
                    }
                    bracket = local_bracket;
                    warned = false;
                    document.getElementById("bracket").replaceChild(matrix_to_table(bracket.to_matrix()),document.getElementById("bracket").firstChild);
                }
                else {
                    if(!warned) {
                        customAlert(new Alert("ok", "Bracket is being edited"));
                        warned = true;
                    }
                }
            }
            else if(xmlHttp.status == 403) {
                if(!warned) {
                    customAlert(new Alert("error", "Sheet isn't public"));
                    warned = true;
                }
            }
        }
    };

    xmlHttp.open("GET", get_sheets_req(sheet_id), true);
    xmlHttp.send(null);
}