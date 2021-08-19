class Bracket {
    constructor() {
        this.rounds = [];
    }

    populate(data) {
        for(let i = 0;i < data.length; i++) {
            var real_j = 0;
            for(let j = 0; j < this.rounds[i].teams.length; j++) {
                while (data[i][real_j + 2] == "") {
                    real_j++;
                }
                console.log(data[i][real_j + 2]);
                this.rounds[i].teams[j].name = data[i][real_j + 2] || "";
                real_j++;
            }
        }
    }

    update() {
        for(let i = 0; i < this.rounds.length - 1; i++) {
            for(let j = 0; j < this.rounds[i].teams.length; j += 2) {
                this.rounds[i].teams[j].cell.style.opacity = 1;
                this.rounds[i].teams[j].cell.style.textDecoration = "none";
                
                this.rounds[i].teams[j + 1].cell.style.opacity = 1;
                this.rounds[i].teams[j + 1].cell.style.textDecoration = "none";
                if(this.rounds[i].teams[j].name != "" && this.rounds[i].teams[j + 1].name != "")
                {
                    if(includes(this.rounds[i + 1].teams, this.rounds[i].teams[j].name) && !includes(this.rounds[i + 1].teams, this.rounds[i].teams[j + 1].name)) {
                        this.rounds[i].teams[j + 1].cell.style.opacity = 0.5;
                        this.rounds[i].teams[j + 1].cell.style.textDecoration = "line-through";
                    }
                    else if(!includes(this.rounds[i + 1].teams, this.rounds[i].teams[j].name) && includes(this.rounds[i + 1].teams, this.rounds[i].teams[j + 1].name)) {
                        this.rounds[i].teams[j].cell.style.opacity = 0.5;
                        this.rounds[i].teams[j].cell.style.textDecoration = "line-through";
                    }
                }
                this.rounds[i].teams[j].cell.innerText = this.rounds[i].teams[j].name;
                this.rounds[i].teams[j + 1].cell.innerText = this.rounds[i].teams[j + 1].name;
            }
        }

        this.rounds[this.rounds.length - 1].teams[0].cell.innerText = this.rounds[this.rounds.length - 1].teams[0].name;

    }

    to_matrix() {
        function make_cell(type, params) {
            var cell = document.createElement("td");
            cell.style.paddingLeft = "10px";
            if (type == "line_right") {
                cell.style.border = "1px solid white";
                cell.style.borderStyle = "none solid none none";
            }
            else if(type == "line_top_right") {
                cell.style.border = "1px solid white";
                cell.style.borderStyle = "solid solid none none";
            }
            else if(type == "line_bottom_right") {
                cell.style.border = "1px solid white";
                cell.style.borderStyle = "none solid solid none";
            }
            else if(type == "line_bottom") {
                cell.style.border = "1px solid white";
                cell.style.borderStyle = "none none solid none";
            }
            else if(type == "placeholder") {
                cell.innerText = "\xa0";
            }
            else if(type == "text") {
                cell.style.border = "1px solid white";
                cell.innerText = params;
            }
            else if(type == "text_loser") {
                cell.style.border = "1px solid white";
                cell.innerText = params;
                cell.style.textDecoration = "line-through";
                cell.style.opacity = 0.5;
            }
            else if(type == "winner") {
                cell.innerText = params;
                cell.rowSpan = 2;
                cell.style.textAlign = "center";
                cell.style.verticalAlign = "middle";
            }
            else if(type == "round_name") {
                cell.innerText = params;
                cell.style.marginBottom = "4em";
                cell.style.backgroundColor = "rgb(24,24,24)";
                cell.style.padding = "2 10 2 10";
                cell.style.border = "1px solid white";
                cell.style.opacity = 0.8;
            }
            return cell;
        }

        var spacing = 2;
        var offset = 0;
        var i = 0;
        var matrix = [];
        var height = ((this.rounds[0].teams.length / 2) - 1) * 2 + this.rounds[0].teams.length + 2;

        function get_empty() {
            var empty_col = [];
            for (let o = 0; o < height; o++) {
                var cell = make_cell("placeholder");
                cell.style.minWidth = 50;
                empty_col.push(cell);
            }
            return empty_col;
        }

        const tbd = "    ";

        do {
            var column = [];
            column.push(make_cell("round_name",this.rounds[i].name));
            column.push(make_cell("placeholder"));

            for (let o = 0; o < offset; o++) {
                column.push(make_cell("placeholder"));
            }
            for (let index = 0; index < this.rounds[i].teams.length; index+=2) {
                //console.log(this.rounds[i].teams[index]);
                var top_team = this.rounds[i].teams[index] != undefined ? this.rounds[i].teams[index].name == "" ? tbd : this.rounds[i].teams[index].name : tbd;
                var bottom_team = this.rounds[i].teams[index + 1] != undefined ? this.rounds[i].teams[index + 1].name == "" ? tbd : this.rounds[i].teams[index + 1].name : tbd;

                if(i + 1 < this.rounds.length) {
                    if(top_team == tbd || bottom_team == tbd) {
                        var top_cell = make_cell("text", top_team);
                        var bottom_cell = make_cell("text", bottom_team);
                        column.push(top_cell);
                        column.push(bottom_cell)
                        this.rounds[i].teams[index].cell = top_cell;
                        this.rounds[i].teams[index + 1].cell = bottom_cell;
                    }
                    else {
                        if(!includes(this.rounds[i + 1].teams,this.rounds[i].teams[index].name) && includes(this.rounds[i + 1].teams,this.rounds[i].teams[index + 1].name)) {
                            var top_cell = make_cell("text_loser", top_team), bottom_cell = make_cell("text", bottom_team);
                            column.push(top_cell);
                            column.push(bottom_cell)
                            this.rounds[i].teams[index].cell = top_cell;
                            this.rounds[i].teams[index + 1].cell = bottom_cell;
                        }
                        else if(!includes(this.rounds[i + 1].teams, this.rounds[i].teams[index + 1].name) && includes(this.rounds[i + 1].teams, this.rounds[i].teams[index].name)) {
                            var top_cell = make_cell("text", top_team), bottom_cell = make_cell("text_loser", bottom_team);
                            column.push(top_cell);
                            column.push(bottom_cell)
                            this.rounds[i].teams[index].cell = top_cell;
                            this.rounds[i].teams[index + 1].cell = bottom_cell;
                        }
                        else {
                            var top_cell = make_cell("text", top_team);
                            var bottom_cell = make_cell("text", bottom_team);
                            column.push(top_cell);
                            column.push(bottom_cell)
                            this.rounds[i].teams[index].cell = top_cell;
                            this.rounds[i].teams[index + 1].cell = bottom_cell;
                        }
                    }
                }
                else {
                    var top_cell = make_cell("text", top_team);
                    var bottom_cell = make_cell("text", bottom_team);
                    column.push(top_cell);
                    column.push(bottom_cell)
                    this.rounds[i].teams[index].cell = top_cell;
                    this.rounds[i].teams[index + 1].cell = bottom_cell;
                }

                if(index + 2 < this.rounds[i].teams.length) {
                    for (let o = 0; o < spacing; o++) {
                        column.push(make_cell("placeholder"));
                    }
                }
            }
            
            while (column.length < height) {
                column.push(make_cell("placeholder"));
            }

            matrix.push(column);

            if(i + 1 < this.rounds.length - 1) {
                var col = get_empty();
                var j = offset;
                var l = 0;
                while(j < height) {
                    for (let o = 0; o < (spacing / 2) + 2; o++) {
                        
                        if(l % 2 == 0) {
                            col[j + o] = make_cell("line_right");
                        }
                        else {
                            col[j - o] = make_cell("line_right");
                        }
                        //console.log(this.rounds.length);
                    }
                    if(l % 2 == 0) {
                        col[j + 1] = make_cell("line_top_right");
                        col[j] = make_cell("placeholder");
                    }
                    else 
                        col[j] = make_cell("line_bottom_right");

                    l++;
                    j += spacing + 2;
                }

                col.unshift(make_cell("placeholder"));
                col.unshift(make_cell("placeholder"));

                matrix.push(col);
            }
            offset = spacing;
            spacing = 2 * (spacing + 1);
            i++;
            
            if(i < this.rounds.length - 1) {
                var col = get_empty();
                var j = offset;
                while(j < height) {
                    col[j] = make_cell("line_bottom");
                    col[j + 1] = make_cell("placeholder");
                    j += spacing + 2;
                }

                col.unshift(make_cell("placeholder"));
                col.unshift(make_cell("placeholder"));

                matrix.push(col);
            }
        } 
        while(i < this.rounds.length - 1);

        var last = get_empty();
        last[height / 2 - 1] = make_cell("line_bottom");
        
        last.unshift(make_cell("placeholder"));
        
        matrix.push(last);

        if(this.rounds[this.rounds.length - 1].teams.length == 1) {
            var winner_col = get_empty();
            var cell = make_cell("winner",this.rounds[this.rounds.length - 1].teams[0].name);
            winner_col[height / 2 - 1] = cell;
            this.rounds[this.rounds.length - 1].teams[0].cell = cell;
            winner_col.unshift(make_cell("round_name", this.rounds[this.rounds.length - 1].name));
            matrix.push(winner_col);
        }
        return matrix;
    }
}

class Round {
    constructor(name, teams) {
        this.name = name;
        this.teams = teams.filter(e => e.trim() != "").map(team => new Team(team));
    }
}

class Team {
    constructor(name) {
        this.name = name;
        this.cell = null;
    }
}

function matrix_to_table(matrix) {
    var height = matrix[0].length;
    var width = matrix.length;

    var table = document.createElement("table");
    table.style.borderSpacing = "0px";

    for (let y = 0; y < height; y++) {
        var row = document.createElement("tr");

        for (let x = 0; x < width; x++) {
            row.appendChild(matrix[x][y]);
        }
        table.appendChild(row);
    }

    table.style.color = "white";
    table.style.margin = "0 auto";
    table.style.fontSize = "1.2em";

    table.style.marginTop = "100px";

    table.classList.add("bracket");

    return table;
}


function includes(arr, val) {
    for(let i = 0; i < arr.length; i++){
        if(arr[i].name == val)
            return true;
    }

    return false;
}