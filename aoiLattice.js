var Node = function(id, ctx){
    this.ctx = ctx;
    this.xMax = 800;
    this.yMax = 600;
    this.id = id;
    this.x = Math.random() * this.xMax;
    this.y = Math.random() * this.yMax;
    this.xSpeed = Math.random() * 5 + 0.1;
    this.ySpeed = Math.random() * 5 + 0.1;
    this.xDir = (Math.random() < 0.5)?-1:1;
    this.yDir = (Math.random() < 0.5)?-1:1;
    this.lattice = null;
}

Node.prototype.move = function(lattice){
    if(this.lattice){
        this.lattice.leave(this);
    }

    this.x += this.xSpeed * this.xDir;
    this.y += this.ySpeed * this.yDir;
    

    if(this.x < 0){
        this.x = 0 - this.x;
        this.xDir = 1;
    }
    else if(this.x > this.xMax){
        this.x = this.xMax - (this.x - this.xMax);
        this.xDir = -1;
    }

    if(this.y < 0){
        this.y = 0 - this.y;
        this.yDir = 1;
    }
    else if(this.y > this.yMax){
        this.y = this.yMax - (this.y - this.yMax);
        this.yDir = -1;
    }

    this.lattice = lattice[Math.floor(this.x / 10)][Math.floor(this.y / 10)].add(this);

    this.show();
}

Node.prototype.show = function(){
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

var Lattice = function(x, y) {
    this.cx = x; // center x
    this.cy = y; // center y
    this.list = [];
}

Lattice.prototype.add = function(node){
    this.list.push(node);
    return this;
}

Lattice.prototype.leave = function(node){
    var len = this.list.length;
    for(var i = 0; i < len; i ++){
        if(this.list[i].id == node.id){
            this.list.splice(i, 1);
            break;
        }
    }
}


var checkAvailableLattice = function(latList){
    var count = 0,
        getAvailableCount = function(lattice, latList, i, j){
            var list1 = lattice.list,
                list2 = [];
            if(i >= 80 || j >= 60 || j < 0 || i < 0){
                return 0;
            }
            else{
                list2 = latList[i][j].list;
            }

            var len1 = list1.length,
                len2 = list2.length,
                count = 0;

            if(len1 == 0 || len2 == 0){
                return 0;
            }

            for(var k = 0; k < len1; k ++){
                for(var w = 0; w < len2; w ++){
                    var sx = list1[k].x,
                        sy = list1[k].y,
                        ex = list2[w].x,
                        ey = list2[w].y,
                        dst = Math.sqrt((sx - ex) * (sx - ex) + (sy - ey) * (sy - ey));
                    if(dst <= 10){
                        // $("#effectedList").append("<p>" + list[i].id + "<--->" + list[j].id + "</p>");
                        count ++;
                    }
                }
            }

            return count;
        };


    for(var i = 0; i < 80; i ++){
        for(var j = 0; j < 60; j ++){
            if(latList[i][j].list.length == 0){
                continue;
            }

            count += (latList[i][j].list.length - 1);

            count += getAvailableCount(latList[i][j], latList, (i + 1), j); // right
            count += getAvailableCount(latList[i][j], latList, (i + 1), (j + 1)); // right bottom
            count += getAvailableCount(latList[i][j], latList, i, (j + 1)); // bottom
            count += getAvailableCount(latList[i][j], latList, (i - 1), (j + 1)); // left bottom
        }
    }

    $("#listNum").text(count);
}

$(document).ready(function(){
    var startTime = (new Date()).getTime(),
        frames = 0,
        nodeList = [],
        latList = [],
        nodeNum = 3000,
        intevalIndex,
        skip = 0;

    var canvas = document.getElementById("field"),
        ctx = canvas.getContext("2d");

    for(var i = 0; i < 80; i ++){
        latList[i] = new Array(60);
        for(var j = 0; j < 60; j ++){
            latList[i][j] = new Lattice(i * 10 + 5, j * 10 + 5);
        }
    }

    intevalIndex = setInterval(function(){
        var now = (new Date()).getTime();
        if(now - startTime > 1000){
            frames = frames / (now - startTime) * 2000;
            $("#fps").text(frames.toFixed(2));
            if(frames < 30 && skip > 3){
                clearInterval(intevalIndex);
            }
            skip ++;
            frames = 0;
            startTime = now;
        }
        else{
            frames ++;
        }
        ctx.fillStyle = "#FFFFFF";
        ctx.clearRect(0, 0, 800, 600);

        ctx.fillStyle = "#FF0000";

        for(var i = 0; i < nodeList.length; i ++){
            nodeList[i].move(latList);
        }

        $("#effectedList").empty();

        var start = (new Date()).getTime(),
            end = 0;
        checkAvailableLattice(latList);
        end = (new Date()).getTime();

        $("#timeCost").text(end - start);

        if(skip > 3){
            nodeList.push(new Node(nodeList.length, ctx));
        }

        $("#amount").text(nodeList.length)
    },
    20);

    for(var i = 0; i < nodeNum; i ++){
        nodeList.push(new Node(i, ctx));
    }
});


