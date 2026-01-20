//starting point of learning
    console.log("This is how you code in java script");

document.addEventListener('DOMContentLoaded', function(){

    const studentBtn = document.getElementById('studentBtn');
    const teachertBtn = document.getElementById('teacherBtn');

    studentBtn.addEventListener('click', function(){
        window.location.href = 'student.html';
    });

    teachertBtn.addEventListener('click', function(){
        window.location.href = 'teacher.html';
    });
})
