window.onload = function () {
    //封装一个函数放入地图
    var map = document.getElementById('map');
    var element = [];
    function createDiv(index, top, left) {
        var node = document.createElement('div');//创建一个div节点
        var img = document.createElement('img');
        node.style.width = "30px";
        node.style.height = "30px";
        node.style.position = "absolute";
        node.style.top = top + 'px';
        node.style.left = left + 'px';
        map.appendChild(node);
        node.setAttribute('class', index);
        return node;
    }
    //初始化分数
    var score = 0;
    //初始化难度，默认为简单难度 1s蛇移动一次
    var speed = sessionStorage.getItem('snakeSpeed');
    //如果没有设置难度，默认简单难度
    if (speed == null) {
        speed = 500;
    }
    //初始化移动方向，默认向右移动
    var direct_x = 0;//1代表向下移动，-1代表向上移动
    var direct_y = 1;//1代表向右移动，-1代表向左移动
    //初始化标记食物是否被吃
    var isEated = false;
    //标记暂停键 0开始 1暂停
    var flag = 0;
    //标记游戏结束
    var isGameOver = false;
    //获取积分盒子
    var score_box = document.querySelector(".score_box");
    //获取积分内容
    var score_text = score_box.children[0];
    console.log(score_text);
    //获取在玩一局按钮
    var gameAgain = score_box.children[1];
    gameAgain.addEventListener('click', function () {
        location.reload();
    })
    //通过按键控制蛇移动
    if (flag != 1) {
        document.addEventListener('keydown', function (event) {
            //上38 下40 左37 右39
            switch (event.keyCode) {
                case 38:
                    //防止蛇调头
                    if (direct_x != 1) {
                        direct_x = -1;
                        direct_y = 0;
                    }
                    break;
                case 40:
                    if (direct_x != -1) {
                        direct_x = 1;
                        direct_y = 0;
                    }
                    break;
                case 37:
                    if (direct_y != 1) {
                        direct_x = 0;
                        direct_y = -1;
                    }
                    break;
                case 39:
                    if (direct_y != -1) {
                        direct_x = 0;
                        direct_y = 1;
                    }
                    break;
            }
        })
    }
    //默认蛇头红色，蛇身蓝色，创建一个三节点蛇
    var x = 0;
    var y = 0;
    var snake = [{ x: 0, y: 2 }, { x: 0, y: 1 }, { x: 0, y: 0 }];
    //画蛇
    function drawSnake() {
        for (var i = 0; i < snake.length; i++) {
            if (i == 0) {
                createDiv('head', snake[i].x * 30, snake[i].y * 30);
            } else {
                createDiv('body', snake[i].x * 30, snake[i].y * 30);
            }
        }
    }
    //画出初始的蛇
    drawSnake();
    //初始化食物
    var food_x = Math.floor(Math.random() * 20);
    var food_y = Math.floor(Math.random() * 20);
    //判断食物不能在蛇身上
    function isSnake() {
        for (var i = 0; i < snake.length; i++) {
            if (snake[i].x == food_x && snake[i].y == food_y) {
                return true;
            }
        }
        return false;
    }
    function food() {
        //食物不能生成在蛇身上
        while (isSnake()) {
            food_x = Math.floor(Math.random() * 20);
            food_y = Math.floor(Math.random() * 20);
        }
        createDiv('food', food_x * 30, food_y * 30);
    }
    //生成食物
    food();
    //蛇的移动  分为蛇头移动和蛇身移动
    //蛇身移动很简单，就是下一个节点移动到上一个节点
    //蛇头移动需要根据方向判断移动的位置
    //游戏结束判定 蛇撞墙会死，蛇撞到自己会死
    function move() {
        //游戏结束停止移动函数
        if (isGameOver) {
            score_box.style.display = "block";
            score_text.innerHTML = "游戏结束，总分:" + score + '分';
            return;
        }
        // 删除既往画的蛇
        var head = document.querySelectorAll('.head');
        var body = document.querySelectorAll('.body');
        for (var i = 0; i < head.length; i++) {
            map.removeChild(head[i]);
        }
        for (var j = 0; j < body.length; j++) {
            map.removeChild(body[j]);
        }
        //蛇头移动，创建新蛇头,老蛇头变成蛇身第一个节点
        var newNode = {
            x: snake[0].x + direct_x,
            y: snake[0].y + direct_y
        }
        //判断游戏结束，如果超出边界游戏结束
        if (newNode.x < 0 || newNode.y < 0 || newNode.x * 30 >= 600 || newNode.y * 30 >= 600) {
            isGameOver = true;
        }
        //蛇头撞到自己游戏结束
        for (var k = 0; k < snake.length; k++) {
            if (newNode.x == snake[k].x && newNode.y == snake[k].y) {
                isGameOver = true;
            }
        }
        //游戏正常进行继续执行
        if (isGameOver == false) {
            snake.unshift(newNode);
            //蛇吃食物 蛇吃到食物食物消失并随机生成，蛇生长一格
            if (newNode.x == food_x && newNode.y == food_y) {
                isEated = true;
                score += 10;//吃到食物加分
            } else {
                isEated = false;
                // 没吃到食物清除尾节点
                snake.pop();
            }
        }
        //吃到食物，食物再次生成
        if (isEated) {
            //清除老食物
            map.removeChild(map.children[0]);
            //生成食物
            food();
        }
        //去除尾节点蛇身自己移动
        drawSnake();
        //根据上下左右判断蛇头转向 向右默认 由于既往蛇被清楚，蛇头节点在第二个
        if (direct_x == -1 && direct_y == 0) {
            map.children[1].style.transform = 'rotate(270deg)';
        } else if (direct_x == 0 && direct_y == -1) {
            map.children[1].style.transform = 'rotate(180deg)';
        } else if (direct_x == 1 && direct_y == 0) {
            map.children[1].style.transform = 'rotate(90deg)';
        }
    }
    var timer = setInterval(move, speed);
    //定时器使得蛇可以移动 按空格键蛇暂停 
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 32 && flag == 0) {
            clearInterval(timer);
            flag = 1;
        } else if (event.keyCode == 32 && flag == 1) {
            timer = setInterval(move, speed);
            flag = 0;
        }
    })
}