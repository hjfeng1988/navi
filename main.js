let allData = [];
const nav = document.getElementById('nav');
const search = document.querySelector('.search');

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
                </a>`;
            } else {
              let desc = site.desc + ' 正在建设中...';
              return `<div class="site-item disabled-site">
                  <span class="site-name">${site.name}</span>
                  <span class="site-desc">${desc}</span>
                </div>`;
            }
          }).join('')}
        </div>
      </div>`
    ).join('');
}

fetch('sites.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderNav(allData);
  })
  .catch(() => {
    nav.innerHTML = '<p class="nowrap">导航数据加载失败，可能原因：本地file协议，json格式错误</p>';
  });

search.addEventListener('input', function() {
  const keyword = this.value.trim().toLowerCase();
  if (!keyword) return renderNav(allData);
  const filtered = allData
    .map(group => ({
      ...group,
      sites: group.sites.filter(site => site.name.toLowerCase().includes(keyword))
    }))
    .filter(group => group.sites.length);
  renderNav(filtered);
});