const google_key = "AIzaSyBHGQ_OtXLyK70pPLEqC7eLj77-Mllf0gw";

function get_sheets_req(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/'BracketedData'!A1:Z?key=${google_key}&majorDimension=COLUMNS`;
}

function get_sheets_data(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}?key=${google_key}`;
}

function get_metadata_req(sheet_id) {
    return `https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values/'Metadata'!A1:Z?key=${google_key}&majorDimension=ROWS`;
}

let bracket = null;
let metadata = {};
let warned = false;
let startup = true;

function load_metadata(sheet_id) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                let res = JSON.parse(xmlHttp.responseText).values;

                for (let i = 0; i < res.length; i++) {
                    if (res[i].length >= 2) {
                        if (res[i][0] != "Team Name") {
                            metadata[res[i][0]] = res[i][1];
                        }
                        else {
                            let labels = res[i].slice();

                            let make_team = function(arr) {
                                let t = {
                                    Members: arr[1].split(',').filter(t => t.trim() != "").map(m => m.trim())
                                };

                                for (let j = 2; j < arr.length; j++) {
                                    t[labels[j]] = arr[j];
                                }

                                return t;
                            };

                            i++;
                            metadata["teams"] = {};

                            while (i < res.length) {
                                metadata["teams"][res[i][0]] = make_team(res[i]);
                                i++;
                            }
                        }
                    }
                }

                if(startup) {
                    startup = false;
                    if(metadata.Theme != undefined && metadata.Theme != document.documentElement.getAttribute("theme")) {
                        document.documentElement.setAttribute("theme", metadata.Theme);
                    }
                }

                if(metadata.Name != undefined) {
                    document.title = metadata.Name;
                }
            }
            else if (xmlHttp.status == 403) {
                if (!warned) {
                    customAlert(new Alert("error", "Sheet isn't public"));
                    warned = true;
                }
            }
        }
    };

    xmlHttp.open("GET", get_metadata_req(sheet_id), true);
    xmlHttp.send(null);
}

function isPowerOfTwo(n) {
    if (n == 0)
        return false;

    return parseInt((Math.ceil((Math.log(n) / Math.log(2))))) == parseInt((Math.floor(((Math.log(n) / Math.log(2))))));
}

function load_bracket(sheet_id) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                let res = JSON.parse(xmlHttp.responseText);
                if (res.values[0][0].trim().toLowerCase() == "ok") {
                    if (bracket == null || bracket.reload) {
                        let local_bracket = new Bracket();

                        local_bracket.type = bracket != null ? bracket.type : "default";

                        let team_count = res.values[0].slice(2).length;
                        while (!isPowerOfTwo(team_count)) team_count++;
                        for (let i = 0; i < res.values.length; i++) {
                            const element = res.values[i];
                            let round = new Round(element[1], element.slice(2), i, i + 1 == res.values.length, local_bracket);

                            while (round.teams.length < team_count) {
                                round.teams.push(new Team(""));
                            }

                            team_count /= 2;

                            local_bracket.rounds.push(round);
                        }

                        bracket = local_bracket;
                        warned = false;
                        document.getElementById("bracket").replaceChild(matrix_to_table(bracket.to_matrix()), document.getElementById("bracket").firstChild);
                    }
                    else {
                        bracket.populate(res.values);
                        bracket.update();
                    }
                    update_settings();
                }
                else {
                    if (!warned) {
                        customAlert(new Alert("ok", "Bracket is being edited"));
                        warned = true;
                    }
                }
            }
            else if (xmlHttp.status == 403) {
                if (!warned) {
                    customAlert(new Alert("error", "Sheet isn't public"));
                    warned = true;
                }
            }
        }
    };

    xmlHttp.open("GET", get_sheets_req(sheet_id), true);
    xmlHttp.send(null);
}