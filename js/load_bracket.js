const google_key = "AIzaSyBzju6OEbSXAah79LidRQVbzWJFxT0rXjc";

function get_sheets_req(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/'BracketedData'!A1:Z?key=${google_key}&majorDimension=COLUMNS`;
}

function get_sheets_data(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}?key=${google_key}`;
}

var bracket = null;

var warned = false;

function isPowerOfTwo(n)
{
    if (n == 0)
        return false;

    return parseInt( (Math.ceil((Math.log(n) / Math.log(2))))) == parseInt( (Math.floor(((Math.log(n) / Math.log(2))))));
}

function load_bracket(sheet_id) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if(xmlHttp.status == 200) {
                var res = JSON.parse(xmlHttp.responseText);
                console.log(res.values);
                if(res.values[0][0].trim().toLowerCase() == "ok") {
                    if(bracket == null) {
                        var local_bracket = new Bracket();
                        var team_count = res.values[0].slice(2).length;
                        while (!isPowerOfTwo(team_count)) team_count++;
                        for (let i = 0; i < res.values.length; i++) {
                            const element = res.values[i];
                            var round = new Round(element[1], element.slice(2));

                            while (round.teams.length < team_count) {
                                round.teams.push(new Team(""));
                            }

                            team_count /= 2;

                            local_bracket.rounds.push(round);
                        }

                        bracket = local_bracket;
                        warned = false;
                        document.getElementById("bracket").replaceChild(matrix_to_table(bracket.to_matrix()),document.getElementById("bracket").firstChild);
                    }
                    else {
                        bracket.populate(res.values);
                        bracket.update();
                    }
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