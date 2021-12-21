window.onload = function () {
    var modes = document.getElementsByName('mode');
    var speed = 500;
    for (var i = 0; i < modes.length; i++) {
        modes[i].onchange = function(){
            if(this.checked == true){
                speed = this.value;
                //储存蛇速度数据
                sessionStorage.setItem('snakeSpeed',speed)
            }
        }
    }
}