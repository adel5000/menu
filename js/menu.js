const container = document.getElementById('menuContainer');

// دالة لعرض القائمة من البيانات المعطاة
function renderMenu(menuData) {
  container.innerHTML = "";

  if (!menuData || Object.keys(menuData).length === 0) {
    container.innerHTML = '<p class="no-data">لا توجد بيانات لعرضها. الرجاء إضافة بيانات في لوحة الإدارة.</p>';
    return;
  }

  for (const mainCategory in menuData) {
    const mainCatElem = document.createElement('div');

    const h2 = document.createElement('h2');
    h2.textContent = mainCategory;
    mainCatElem.appendChild(h2);

    for (const subCategory in menuData[mainCategory]) {
      const subCatElem = document.createElement('div');

      const h3 = document.createElement('h3');
      h3.textContent = subCategory;
      subCatElem.appendChild(h3);

      const ul = document.createElement('ul');
      const items = menuData[mainCategory][subCategory];

      if (items.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'لا توجد عناصر';
        ul.appendChild(li);
      } else {
        items.forEach(item => {
          const li = document.createElement('li');
          li.className = 'menu-item';

          // صورة المنتج
          if (item.image) {
            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.className = 'item-image';
            li.appendChild(img);
          }

          const infoDiv = document.createElement('div');
          infoDiv.className = 'item-info';

          const name = document.createElement('div');
          name.className = 'item-name';
          name.textContent = item.name;

          const desc = document.createElement('div');
          desc.className = 'item-desc';
          desc.textContent = item.description;

          const price = document.createElement('div');
          price.className = 'item-price';
          price.textContent = item.price;

          infoDiv.appendChild(name);
          infoDiv.appendChild(desc);
          infoDiv.appendChild(price);

          li.appendChild(infoDiv);
          ul.appendChild(li);
        });
      }

      subCatElem.appendChild(ul);
      mainCatElem.appendChild(subCatElem);
    }

    container.appendChild(mainCatElem);
  }
}

// محاولة جلب البيانات من localStorage أولاً
let menuData = JSON.parse(localStorage.getItem('menuData'));

if (menuData && Object.keys(menuData).length > 0) {
  renderMenu(menuData);
} else {
  // تحميل البيانات من ملف JSON
  fetch('data.json')
    .then(response => {
      if (!response.ok) throw new Error("فشل تحميل ملف البيانات");
      return response.json();
    })
    .then(data => {
      menuData = data;
      localStorage.setItem('menuData', JSON.stringify(menuData));
      renderMenu(menuData);
    })
    .catch(err => {
      container.innerHTML = '<p class="no-data">❌ تعذر تحميل بيانات القائمة.</p>';
      console.error(err);
    });
}
