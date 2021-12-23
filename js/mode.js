window.onload = function () {
    var modes = document.getElementsByName('mode');
    var speed = 500;
    var index = sessionStorage.getItem('index');
    //默认简单难度
    if (index == null) {
        index = 0;
    }
    modes[index].checked = true;
    for (var i = 0; i < modes.length; i++) {
        modes[i].setAttribute('data-index', i);
        modes[i].onchange = function () {
            if (this.checked == true) {
                speed = this.value;
                //储存蛇速度数据
                sessionStorage.setItem('snakeSpeed', speed);
                //储存按键索引
                index = this.getAttribute('data-index')
                sessionStorage.setItem('index', index);
            }
        }
    }
}