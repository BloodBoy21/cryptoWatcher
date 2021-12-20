/* eslint-disable  no-unused-vars, no-undef */
const top50 = document.getElementById('top50')
const getTopData = () => {
  fetch('/api/top50')
    .then((res) => res.json())
    .then((data) => {
      let cryptoList = ''
      for (let i = 0; i < data.length; i++) {
        cryptoList += `
            <tr >
                <td class=" border border-gray-300">${i + 1}</td>
                <td class="px-4 py-2 border border-gray-300">${
                  data[i].name
                }</td>
                <td class="px-4 py-2 border border-gray-300">${
                  data[i].mainPrice
                }</td>
                <td class="px-4 py-2 border border-gray-300">${
                  data[i].marketCap
                }</td>
                <td class="px-4 py-2 border border-gray-300">${
                  data[i].volume
                }</td>
            </tr>
            `
      }
      top50.innerHTML += cryptoList
    })
}
// window.onload = getTopData()
