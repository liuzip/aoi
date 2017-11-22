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
}

Node.prototype.move = function(){
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

    this.show();
}

Node.prototype.show = function(){
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}


var checkAvailableDist = function(list){
    var len = list.length,
        count = 0;
    for(var i = 0; i < len; i ++){
        for(var j = (i + 1); j < len; j ++){
            var sx = list[i].x,
                sy = list[i].y,
                ex = list[j].x,
                ey = list[j].y,
                dst = Math.sqrt((sx - ex) * (sx - ex) + (sy - ey) * (sy - ey));
            if(dst < 10){
                // $("#effectedList").append("<p>" + list[i].id + "<--->" + list[j].id + "</p>");
                count ++;
            }
        }
    }

    $("#listNum").text(count);
}


$(document).ready(function(){
    var startTime = (new Date()).getTime(),
        frames = 0,
        list = [],
        nodeNum = 3000,
        intevalIndex,
        skip = 0;

    var canvas = document.getElementById("field"),
        ctx = canvas.getContext("2d");

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

        for(var i = 0; i < list.length; i ++){
            list[i].move();
        }

        $("#effectedList").empty();

        var start = (new Date()).getTime(),
            end = 0;
        checkAvailableDist(list);
        end = (new Date()).getTime();

        $("#timeCost").text(end - start);

        if(skip > 3){
            list.push(new Node(list.length, ctx));
        }

        $("#amount").text(list.length)
    },
    20);

    for(var i = 0; i < nodeNum; i ++){
        list.push(new Node(i, ctx));
    }
});


