const code = document.getElementById('code');
const result = document.getElementById('result');

if (!code || !result) {
  throw new Error('DOM Error');
}

code.oninput = event => {
  console.log(event);
  result.textContent = (code as HTMLTextAreaElement).value;
};
