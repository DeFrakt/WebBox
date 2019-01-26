//DIV random color
function getRandomColor() {
  return "#" + (Math.round(Math.random() * 0XFFFFFF)).toString(16);
}
//global box counter
var boxCount = 0;
//create DIV
function createBox(){
    //create div 
    var div = document.createElement("div");
    //add div class/ID/html
    div.classList.add("box");
    div.innerHTML = boxCount;
    div.id = boxCount;
    div.style.backgroundColor = getRandomColor();
    //append box to document
    document.body.appendChild(div);
    //add to box counter
    boxCount += 1;
    //check total number of box classes, set resize
    var box_element = document.getElementsByClassName("box");
    for(i=0; i < box_element.length; i++){
      resize(box_element[i].id);
    }
}

//Resize & Move DIV
function resize(element_id){
  // Minimum resizable area
  var minWidth = 60;
  var minHeight = 40;

  // Thresholds
  var MARGINS = 10;

  var clicked = null;
  var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

  var b, x, y;

  var redraw = false;

  var pane = document.getElementById(element_id);
  var ghostpane = document.getElementById('ghostpane');
  
  function setBounds(element, x, y, w, h) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = w + 'px';
    element.style.height = h + 'px';
  }

  function hintHide() {
    setBounds(ghostpane, b.left, b.top, b.width, b.height);
    ghostpane.style.opacity = 0;
  }

  // Mouse events
  pane.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);

  // Touch events	
  pane.addEventListener('touchstart', onTouchDown);
  document.addEventListener('touchmove', onTouchMove);
  document.addEventListener('touchend', onTouchEnd);


  function onTouchDown(e) {
    onDown(e.touches[0]);
    e.preventDefault();
    pane.style.borderColor = "yellow";
  }

  function onTouchMove(e) {
    onMove(e.touches[0]);		
  }

  function onTouchEnd(e) {
    if (e.touches.length ==0) onUp(e.changedTouches[0]);
  }

  function onMouseDown(e) {
    onDown(e);
    e.preventDefault();
    pane.style.borderColor = "yellow";
  }

  function onDown(e) {
    calc(e);

    var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

    clicked = {
      x: x,
      y: y,
      cx: e.clientX,
      cy: e.clientY,
      w: b.width,
      h: b.height,
      isResizing: isResizing,
      isMoving: !isResizing && canMove(),
      onTopEdge: onTopEdge,
      onLeftEdge: onLeftEdge,
      onRightEdge: onRightEdge,
      onBottomEdge: onBottomEdge
    };
  }

  function canMove() {
    return pane;
  }

  function calc(e) {
    b = pane.getBoundingClientRect();
    x = e.clientX - b.left;
    y = e.clientY - b.top;

    onTopEdge = y < MARGINS;
    onLeftEdge = x < MARGINS;
    onRightEdge = x >= b.width - MARGINS;
    onBottomEdge = y >= b.height - MARGINS;

    rightScreenEdge = window.innerWidth - MARGINS;
    bottomScreenEdge = window.innerHeight - MARGINS;
  }

  var e;

  function onMove(ee) {
    calc(ee);

    e = ee;

    redraw = true;

  }

  function animate() {

    requestAnimationFrame(animate);

    if (!redraw) return;

    redraw = false;

    if (clicked && clicked.isResizing) {

      if (clicked.onRightEdge) pane.style.width = Math.max(x, minWidth) + 'px';
      if (clicked.onBottomEdge) pane.style.height = Math.max(y, minHeight) + 'px';

      if (clicked.onLeftEdge) {
        var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
        if (currentWidth > minWidth) {
          pane.style.width = currentWidth + 'px';
          pane.style.left = e.clientX + 'px';	
        }
      }

      if (clicked.onTopEdge) {
        var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
        if (currentHeight > minHeight) {
          pane.style.height = currentHeight + 'px';
          pane.style.top = e.clientY + 'px';	
        }
      }

      hintHide();

      return;
    }

    if (clicked && clicked.isMoving) {

      //moving
      pane.style.top = (e.clientY - clicked.y) + 'px';
      pane.style.left = (e.clientX - clicked.x) + 'px';

      return;
    }

    //style cursor
    if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
      pane.style.cursor = 'nwse-resize';
    } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
      pane.style.cursor = 'nesw-resize';
    } else if (onRightEdge || onLeftEdge) {
      pane.style.cursor = 'ew-resize';
    } else if (onBottomEdge || onTopEdge) {
      pane.style.cursor = 'ns-resize';
    } else if (canMove()) {
      pane.style.cursor = 'move';
    } else {
      pane.style.cursor = 'default';
    }
  }

  animate();

  function onUp(e) {
    calc(e);

    clicked = null;
    pane.style.borderColor = "black";
  } 
}
