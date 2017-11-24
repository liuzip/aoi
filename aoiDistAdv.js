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
    this.list = [];
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
    ctx.stroke();
    ctx.fillText(this.id, this.x, this.y);
    ctx.closePath();
}

Node.prototype.addNode = function(node){
    this.list.push({
        left: calculateTime(this, node),
        node: node
    });
}

var calculateTime = function(node1, node2){
    var xt = 0,
        yt = 0;

    if(node1.xDir == 1 && node2.xDir == 1){
        xt = (1600 - node1.x - node2.x) / (node1.xSpeed + node2.xSpeed);
    }
    else if(node1.xDir == -1 && node2.xDir == -1){
        xt = (node1.x + node2.x) / (node1.xSpeed + node2.xSpeed);
    }
    else{
        if((node1.x >= node2.x && node1.xDir == 1 && node2.xDir == -1) ||
            (node1.x <= node2.x && node1.xDir == -1 && node2.xDir == 1)){
            xt = (1600 - Math.abs(node1.x - node2.x)) / (node1.xSpeed + node2.xSpeed);
        }
        else{
            xt = (Math.abs(node1.x - node2.x)) / (node1.xSpeed + node2.xSpeed);
        }
    }


    if(node1.yDir == 1 && node2.yDir == 1){
        yt = (1200 - node1.y - node2.y) / (node1.ySpeed + node2.ySpeed);
    }
    else if(node1.yDir == -1 && node2.yDir == -1){
        yt = (node1.y + node2.y) / (node1.ySpeed + node2.ySpeed);
    }
    else{
        if((node1.y >= node2.y && node1.yDir == 1 && node2.yDir == -1) ||
            (node1.y <= node2.y && node1.yDir == -1 && node2.yDir == 1)){
            yt = (1200 - Math.abs(node1.y - node2.y)) / (node1.ySpeed + node2.ySpeed);
        }
        else{
            yt = (Math.abs(node1.y - node2.y)) / (node1.ySpeed + node2.ySpeed);
        }
    }

    return Math.min(xt, yt);
}

var checkAvailableDist = function(list){
    var count = 0;

    for(var i = 0; i < list.length; i ++){
        var node = list[i];
        for(var j = 0; j < node.list.length; j ++){
            console.log(node.list[j].left);
            if(node.list[j].left > 3){
                node.list[j].left --;
            }
            else{
                var sx = node.x,
                    sy = node.y,
                    ex = node.list[j].node.x,
                    ey = node.list[j].node.y,
                    dst = Math.sqrt((sx - ex) * (sx - ex) + (sy - ey) * (sy - ey));
                if(dst <= 10){
                    // $("#effectedList").append("<p>" + list[i].id + "<--->" + list[j].id + "</p>");
                    count ++;
                }

                node.list[j].left = calculateTime(node, node.list[j].node);
            }
        }
    }

    $("#listNum").text(count);
}

$(document).ready(function(){
    var startTime = (new Date()).getTime(),
        frames = 0,
        nodeList = [],
        nodeNum = 2,
        intevalIndex,
        skip = 0;

    var canvas = document.getElementById("field"),
        ctx = canvas.getContext("2d");

    for(var i = 0; i < nodeNum; i ++){
        var node = new Node(i, ctx);
        for(var j = 0; j < nodeList.length; j ++){
            nodeList[j].addNode(node);
        }
        nodeList.push(node);
    }


    intevalIndex = setInterval(function(){
        var now = (new Date()).getTime();
        if(now - startTime > 1000){
            frames = frames / (now - startTime) * 2000;
            $("#fps").text(frames.toFixed(2));
            if(frames < 30 && skip > 3){
                // clearInterval(intevalIndex);
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
            nodeList[i].move();
            //for(var j = 0; j < nodeList[i].list.length; j ++){
             //   console.log(nodeList[i].id, nodeList[i].list[j].node.id, nodeList[i].list[j].left, $("#listNum").text())
            //}
        }

        $("#effectedList").empty();

        var start = (new Date()).getTime(),
            end = 0;
        checkAvailableDist(nodeList);
        end = (new Date()).getTime();

        $("#timeCost").text(end - start);

        if(skip > 3){
            //nodeList.push(new Node(nodeList.length, ctx));
        }

        $("#amount").text(nodeList.length)
    },
    20);
});


