window.onload = function() {
  for (let i = 0; i < 4; i++) {
    addCourseRow();
  }
};

function addCourseRow() {
  const tbody = document.getElementById('courseBody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td><input type="text" placeholder="Ders Adı" class="c-name"></td>
    <td><input type="number" placeholder="Vize" min="0" max="100" class="c-vize"></td>
    <td><input type="number" placeholder="40" value="40" min="0" max="100" class="c-vize-weight"></td>
    <td><input type="number" placeholder="Final" min="0" max="100" class="c-final"></td>
    <td><input type="number" placeholder="AKTS" min="1" value="5" class="c-akts"></td>
    <td><button class="btn btn-remove" onclick="removeRow(this)">Sil</button></td>
  `;

  tbody.appendChild(row);
}

function removeRow(button) {
  const row = button.parentElement.parentElement;
  row.remove();
}

function calculate() {
  const rows = document.querySelectorAll('#courseBody tr');
  const resultsList = document.getElementById('resultsList');
  resultsList.innerHTML = '';

  let totalWeightedScore = 0;
  let totalAkts = 0;
  let hasData = false;

  rows.forEach((row, index) => {
    const name = row.querySelector('.c-name').value || `Ders ${index + 1}`;
    const vize = parseFloat(row.querySelector('.c-vize').value);
    const vizeWeight = parseFloat(row.querySelector('.c-vize-weight').value) / 100;
    const final = parseFloat(row.querySelector('.c-final').value);
    const akts = parseFloat(row.querySelector('.c-akts').value);

    if (!isNaN(vize) && !isNaN(vizeWeight) && !isNaN(final) && !isNaN(akts)) {
      hasData = true;
      const finalWeight = 1 - vizeWeight;
      const courseScore = (vize * vizeWeight) + (final * finalWeight);
      
      totalWeightedScore += courseScore * akts;
      totalAkts += akts;

      const isPass = courseScore >= 50 && final >= 50;
      const badgeClass = isPass ? 'badge-pass' : 'badge-fail';
      const statusText = isPass ? 'Geçti' : 'Kaldı';

      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      resultItem.innerHTML = `
        <span><strong>${name}</strong> — Başarı Notu: <strong>${courseScore.toFixed(1)}</strong></span>
        <span class="score-badge ${badgeClass}">${statusText}</span>
      `;
      resultsList.appendChild(resultItem);
    }
  });

  if (hasData && totalAkts > 0) {
    const avgScore = totalWeightedScore / totalAkts;
    const gpa = (avgScore / 25).toFixed(2);

    document.getElementById('gpaResult').innerText = `${gpa} / 4.00`;
    document.getElementById('score100Result').innerText = `100'lük Sistem Ortalaması: ${avgScore.toFixed(2)}`;
    document.getElementById('resultsSection').style.display = 'block';
  } else {
    alert('Lütfen en az bir ders için Vize, Final ve AKTS notlarını tam giriniz.');
  }
}
