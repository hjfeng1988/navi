let allData = []
const dataFile = 'sites.json'
const nav = document.getElementById('nav')
const search = document.querySelector('.search')


function renderNav(data) {
  nav.innerHTML = data
    .filter(group => group.sites && group.sites.length)
    .map(group => `
      <div class="site-group">
        <h2 class="group-title">${group.group}</h2>
        <div class="group-sites">
          ${group.sites.map(site => {
            if (site.enable == true) {
              return `<a class="site-item" href="${site.url}" target="_blank">
                  <span class="site-name">${site.name}</span>
                  <span class="site-desc">${site.desc}</span>
                </a>`
            } else {
              const newDesc = site.desc + ' 正在建设中...'
              // site.desc += ' 正在建设中...' // bug: 会一直累加
              return `<div class="site-item disabled-site">
                  <span class="site-name">${site.name}</span>
                  <span class="site-desc">${newDesc}</span>
                </div>`
            }
          }).join('')}
        </div>
      </div>`
    ).join('')
}


if (window.location.protocol === 'file:') {
  nav.innerHTML = '<p class="nowrap">请使用HTTP服务器运行此页面（本地file协议不支持fetch请求）</p>'
} else {
  fetch(dataFile)
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      return res.json()
    })
    .then(data => {
      allData = data
      renderNav(allData)
    })
    .catch((err) => {
      if (err.message.includes('HTTP 404')) {
        nav.innerHTML = `<p class="nowrap">${dataFile}文件不存在</p>`
      } else {
        nav.innerHTML = `<p class="nowrap">${dataFile}格式错误</p>`
      } 
    })
}

search.addEventListener('input', function() {
  const keyword = this.value.trim().toLowerCase()
  if (!keyword) return renderNav(allData)
  const filtered = allData
    .map(group => ({
      ...group,
      sites: group.sites.filter(site => site.name.toLowerCase().includes(keyword))
    }))
    .filter(group => group.sites.length)
  renderNav(filtered)
})