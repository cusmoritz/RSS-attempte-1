function drawCircle() {
    // get the coordinates of the click event
    let x = event.clientX;
    let y = event.clientY;
    
    // create a new circle element
    let circle = document.createElement('div');
    circle.classList.add('circle');
    
    // position the circle at the click coordinates
    circle.style.top = y + 'px';
    circle.style.left = x + 'px';
    
    // add the circle to the page
    document.body.appendChild(circle);
    }
    
    // add event listener to the document to listen for clicks
    document.addEventListener('click', drawCircle);