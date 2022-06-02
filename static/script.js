window.addEventListener('load', () => {
  const canvas = document.querySelector('.canvas');
  const btnClear = document.querySelector('.btn-clear');
  const btnSave = document.querySelector('.btn-save');
  const btnPredict = document.querySelector('.btn-predict');

  canvas.height = 200;
  canvas.width = 200;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingQuality = "low";

  let paiting = false;

  const startPosition = e => {
    paiting = true;
    draw(e);
  };

  const finishedPosition = () => {
    paiting = false;
    ctx.beginPath();
  };

  const draw = e => {
    if (!paiting) return;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
  };

  const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const download = () => {
    const data = canvas.toDataURL('image/png');
    const anchor = document.createElement('a');
    anchor.href = data;
    anchor.download = `image_${crypto.randomUUID()}.png`;
    anchor.click();
  };

  const getCanvasBlob = canvas =>
    new Promise(resolve => canvas.toBlob(blob => resolve(blob)));

  const predict = async () => {
    const canvasBlob = await getCanvasBlob(canvas);
    const formData = new FormData();
    formData.append('image_draw', canvasBlob);
    const options = {
      method: 'POST',
      body: formData,
    };
    const response = await fetch('/predict', options);
    const data = await response.text()
    console.log(data);
  };

  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', finishedPosition);
  canvas.addEventListener('mousemove', draw);
  btnClear.addEventListener('click', clearCanvas);
  btnSave.addEventListener('click', download);
  btnPredict.addEventListener('click', predict);
});
