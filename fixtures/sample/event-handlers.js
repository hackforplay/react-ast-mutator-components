let label = 'Good morning';

const btn1 = document.createElement('button');
btn1.addEventListener('click', function(event) {
  label = 'Good evening';
});

const btn2 = document.createElement('button');
btn2.addEventListener('click', function(event) {
  label = 'Good night';
});
