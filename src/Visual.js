const $openClose = document.getElementById("open-close"),
      $aside = document.getElementById("aside"),
      $page = document.getElementById("content");
$openClose.addEventListener("click",()=>{
  $aside.classList.toggle("desplegar");
  $page.classList.toggle("open");
}) 


const Modificar = document.querySelectorAll(".link-light");
  Modificar.forEach(button => {
  button.onclick = function () {
    const container = button.closest(".container-config");
    const inputDisplay = container.querySelector(".container-input-display");
    const labelDisplay = container.querySelector(".container-label-display");

    inputDisplay.classList.remove("settingon");
    inputDisplay.classList.add("settingoff");   
    labelDisplay.classList.remove("settingoff");
    labelDisplay.classList.add("settingon");
  };
});

const editButtons = document.querySelectorAll(".Editar1");
editButtons.forEach(button => {
  button.onclick = function () {
    const container = button.closest(".container-config");
    const inputDisplay = container.querySelector(".container-input-display");
    const labelDisplay = container.querySelector(".container-label-display");

    inputDisplay.classList.remove("settingoff");
    inputDisplay.classList.add("settingon");
    labelDisplay.classList.remove("settingon");
    labelDisplay.classList.add("settingoff");
  };
});


const Modificar2 = document.querySelectorAll(".Control-button");
  Modificar2.forEach(button => {
  button.onclick = function () {
    const container = button.closest(".container-config-administrador");
    const inputDisplay = container.querySelector(".container-input-display");
    const labelDisplay = container.querySelector(".container-label-display");

    inputDisplay.classList.remove("settingon");
    inputDisplay.classList.add("settingoff");   
    labelDisplay.classList.remove("settingoff");
    labelDisplay.classList.add("settingon");
  };
});


const AsignarAlumnos = document.querySelectorAll(".bxs-user-plus");

AsignarAlumnos.forEach(button => {
  button.onclick = function () {
    const container = button.closest(".menu-herramientas");
    const inputDisplay = container.querySelector(".cont-agregar");
    const labelDisplay = container.querySelector(".lista");
    inputDisplay.classList.remove("settingoff");
    inputDisplay.classList.add("settingon");
    labelDisplay.classList.remove("settingon");
    labelDisplay.classList.add("settingoff");
  };
});

const btnDark = document.querySelector(".AgregarAlumnoCurso");

btnDark.onclick = function () {
  AsignarAlumnos.forEach(button => {
    const container = button.closest(".menu-herramientas");
    const inputDisplay = container.querySelector(".cont-agregar");
    const labelDisplay = container.querySelector(".lista");
    inputDisplay.classList.remove("settingon");
    inputDisplay.classList.add("settingoff");
    labelDisplay.classList.remove("settingoff");
    labelDisplay.classList.add("settingon");
  });
};


const editButtons2 = document.querySelectorAll(".Editar");
editButtons2.forEach(button => {
  button.onclick = function () {
    const container = button.closest(".container-config-administrador");
    const inputDisplay = container.querySelector(".container-input-display");
    const labelDisplay = container.querySelector(".container-label-display");
    inputDisplay.classList.remove("settingoff");
    inputDisplay.classList.add("settingon");
    labelDisplay.classList.remove("settingon");
    labelDisplay.classList.add("settingoff");
  };
});

document.addEventListener('DOMContentLoaded', function() {
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  var iconoElement = document.getElementById("menu");
  var sacarrow = document.getElementById("row")
  if(windowWidth <= 848){
    sacarrow.classList.remove("row")
  }
  if (windowWidth <= 819){
    iconoElement.classList.remove('bx-list-minus');
    iconoElement.classList.add('bx-list-plus');
  }else{
    iconoElement.classList.remove('bx-list-plus');
    iconoElement.classList.add('bx-list-minus');
  }

  function adaptarElementos() {
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    var iconoElement = document.getElementById("menu");
    var sacarrow = document.getElementById("row");

    if (windowWidth <= 848) {
      sacarrow.classList.remove("row");
    }

    if (windowWidth <= 819) {
      iconoElement.classList.remove('bx-list-minus');
      iconoElement.classList.add('bx-list-plus');
    } else {
      iconoElement.classList.remove('bx-list-plus');
      iconoElement.classList.add('bx-list-minus');
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    adaptarElementos();
  });
  window.addEventListener('resize', function() {
    adaptarElementos();
  });
  
  iconoElement.addEventListener('click', function() {
    if (windowWidth <= 819) {
    if (iconoElement.classList.contains('bx-list-plus')) {
        iconoElement.classList.remove('bx-list-plus');
        iconoElement.classList.add('bx-list-minus');
    } else {
        iconoElement.classList.remove('bx-list-minus');
        iconoElement.classList.add('bx-list-plus');
    }
    } else {
      if (iconoElement.classList.contains('bx-list-minus')) {
        iconoElement.classList.remove('bx-list-minus');
        iconoElement.classList.add('bx-list-plus');
    } else {
        iconoElement.classList.remove('bx-list-plus');
        iconoElement.classList.add('bx-list-minus');
    }
    }

  });
});


const rotateIcons = document.querySelectorAll('.rotate-icon');
rotateIcons.forEach((rotateIcon) => {
    rotateIcon.addEventListener('mouseenter', () => {
        rotateIcon.classList.remove('rotate-animation');
        void rotateIcon.offsetWidth; 
        rotateIcon.classList.add('rotate-animation');
    });

    rotateIcon.addEventListener('mouseleave', () => {
        rotateIcon.classList.remove('rotate-animation');
    });
});




var accordions = document.getElementsByClassName("acordion");
  for (var i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }


  var accordions = document.getElementsByClassName("acordion");
  for (var i = 0; i < accordions.length; i++) {
    accordions[i].addEventListener("click", function() {
      var icon = this.querySelector("i");
      var currentClass = icon.className;
      if (currentClass.includes("bx-show")) {
        icon.className = currentClass.replace("bx-show", "bx-hide");
      } else {
        icon.className = currentClass.replace("bx-hide", "bx-show");
      }
    });
  }



  window.addEventListener("resize", function() {
    var selectElements = document.getElementsByClassName("container-select");
    var windowWidth = window.innerWidth;
  
    for (var i = 0; i < selectElements.length; i++) {
      var elemento = selectElements[i];
  
      if (windowWidth <= 500) {
        elemento.classList.remove("row");
      } else {
        elemento.classList.add("row");
      }
    }
  });



    const inputElements = document.querySelectorAll('.miInput');
    inputElements.forEach(function(inputElement) {
      inputElement.addEventListener('click', function() {
        this.placeholder = '';
      });
  
      inputElement.addEventListener('blur', function() {
        if (!this.value) {
          this.placeholder = 'Escribe aquí...';
        }
      });
    });
