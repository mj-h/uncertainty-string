let meanInput = document.getElementById('mean');
let uncertInput = document.getElementById('uncertainty');
let uncertStrSpan = document.getElementById('output');

function updateUncertaintyString() {
  let mean = parseFloat(meanInput.value);
  let uncertainty = parseFloat(uncertInput.value);
  if (isNaN(mean)) {
    meanInput.style.color = 'red';
  } else {
    meanInput.style.color = '';
  }
  if (isNaN(uncertainty) || uncertainty === 0) {
    uncertInput.style.color = 'red';
  } else {
    uncertInput.style.color = '';
  }
  if (isNaN(mean) || isNaN(uncertainty) || uncertainty === 0) {
    return;
  }
  let str = UncertStr.UncertaintyString.fromNumbers(mean, uncertainty);
  uncertStrSpan.innerHTML = '"' + str + '"';
}

meanInput.onkeyup = () => {
  updateUncertaintyString();
};
meanInput.onblur = () => {
  updateUncertaintyString();
};
uncertInput.onkeyup = () => {
  updateUncertaintyString();
};
uncertInput.onblur = () => {
  updateUncertaintyString();
};

updateUncertaintyString();

let uncertStrInput = document.getElementById('uncertstr');
let meanSpan = document.getElementById('output-mean');
let uncertSpan = document.getElementById('output-uncert');

function updateMeanAndUncert() {
  let str = uncertStrInput.value;
  try {
    let [mean, uncert] = UncertStr.UncertaintyString.toNumbers(str);
    uncertStrInput.style.color = '';
    meanSpan.innerHTML = mean;
    uncertSpan.innerHTML = hideFloatingPointError(uncert);
  } catch {
    uncertStrInput.style.color = 'red';
  }
}

uncertStrInput.onkeyup = () => {
  updateMeanAndUncert();
};
uncertStrInput.onblur = () => {
  updateMeanAndUncert();
};

updateMeanAndUncert();

function hideFloatingPointError(num) {
  return parseFloat(num).toPrecision(2);
}
