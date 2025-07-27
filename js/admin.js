let menuData = {};

async function init() {
  const local = localStorage.getItem("menuData");
  if (local) {
    menuData = JSON.parse(local);
    finishInit();
  } else {
    try {
      const res = await fetch('data.json');
      if (!res.ok) throw new Error("فشل التحميل");
      const data = await res.json();
      menuData = data;
      localStorage.setItem("menuData", JSON.stringify(data));
      finishInit();
    } catch (err) {
      document.getElementById("loading").textContent = "❌ تعذر تحميل data.json";
      console.error(err);
    }
  }
}

function finishInit() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('menuData', JSON.stringify(menuData));
  renderMenuDisplay();
  updateDropdowns();
}

function addMainCategory() {
  const name = document.getElementById("mainCategoryInput").value.trim();
  if (name && !menuData[name]) {
    menuData[name] = {};
    alert("✅ تمت إضافة الصنف الرئيسي");
    document.getElementById("mainCategoryInput").value = "";
    saveAndRender();
  } else {
    alert("⚠️ الصنف موجود أو غير صالح");
  }
}

function addSubCategory() {
  const main = document.getElementById("mainSelectForSub").value;
  const sub = document.getElementById("subCategoryInput").value.trim();
  if (main && sub && !menuData[main][sub]) {
    menuData[main][sub] = [];
    alert("✅ تمت إضافة الصنف الفرعي");
    document.getElementById("subCategoryInput").value = "";
    saveAndRender();
  } else {
    alert("⚠️ الصنف الفرعي موجود أو غير صالح");
  }
}

function addMenuItem() {
  const main = document.getElementById("mainSelectForItem").value;
  const sub = document.getElementById("subSelectForItem").value;
  const name = document.getElementById("itemNameInput").value.trim();
  const desc = document.getElementById("itemDescInput").value.trim();
  const price = document.getElementById("itemPriceInput").value.trim();
  const file = document.getElementById("itemImageInput").files[0];

  if (!main || !sub || !name || !price || !file) {
    alert("⚠️ تأكد من ملء جميع الحقول وإضافة صورة");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const image = e.target.result;
    const item = { name, description: desc, price, image };

    menuData[main][sub].push(item);

    alert("✅ تمت إضافة العنصر");
    document.getElementById("itemNameInput").value = "";
    document.getElementById("itemDescInput").value = "";
    document.getElementById("itemPriceInput").value = "";
    document.getElementById("itemImageInput").value = "";

    saveAndRender();
  };
  reader.readAsDataURL(file);
}

function updateDropdowns() {
  const mainSub = document.getElementById("mainSelectForSub");
  const mainItem = document.getElementById("mainSelectForItem");
  const subItem = document.getElementById("subSelectForItem");

  [mainSub, mainItem].forEach(select => {
    select.innerHTML = "";
    for (const cat in menuData) {
      const option = new Option(cat, cat);
      select.add(option.cloneNode(true));
    }
  });

  updateSubForItem();
}

function updateSubForItem() {
  const main = document.getElementById("mainSelectForItem").value;
  const subSelect = document.getElementById("subSelectForItem");
  subSelect.innerHTML = "";
  if (menuData[main]) {
    for (const sub in menuData[main]) {
      const option = new Option(sub, sub);
      subSelect.add(option);
    }
  }
}

function resetData() {
  if (confirm("هل أنت متأكد من مسح كل البيانات؟")) {
    menuData = {
      "المقبلات": {
        "الباردة": [],
        "الساخنة": []
      },
      "الأطباق الرئيسية": {
        "لحوم": [],
        "دجاج": [],
        "سمك": [],
        "نباتي": []
      },
      "الحلويات": {
        "شرقية": [],
        "غربية": []
      },
      "المشروبات": {
        "باردة": [],
        "ساخنة": []
      }
    };
    localStorage.setItem("menuData", JSON.stringify(menuData));
    location.reload();
  }
}

function renderMenuDisplay() {
  const container = document.getElementById("menuDisplay");
  container.innerHTML = "";

  for (const mainCat in menuData) {
    const mainDiv = document.createElement("div");
    mainDiv.style.marginBottom = "20px";

    // صنف رئيسي
    const mainHeader = document.createElement("div");
    mainHeader.className = "category-item";

    const mainTitle = document.createElement("h3");
    mainTitle.textContent = mainCat;

    const mainDelBtn = document.createElement("button");
    mainDelBtn.className = "delete-btn";
    mainDelBtn.textContent = "حذف صنف رئيسي";
    mainDelBtn.onclick = () => {
      if (confirm(`حذف الصنف الرئيسي "${mainCat}"؟`)) {
        delete menuData[mainCat];
        saveAndRender();
      }
    };

    mainHeader.appendChild(mainTitle);
    mainHeader.appendChild(mainDelBtn);
    mainDiv.appendChild(mainHeader);

    // أصناف فرعية
    for (const subCat in menuData[mainCat]) {
      const subDiv = document.createElement("div");
      subDiv.style.marginRight = "20px";

      const subHeader = document.createElement("div");
      subHeader.className = "category-item";

      const subTitle = document.createElement("h4");
      subTitle.textContent = subCat;

      const subDelBtn = document.createElement("button");
      subDelBtn.className = "delete-btn";
      subDelBtn.textContent = "حذف صنف فرعي";
      subDelBtn.onclick = () => {
        if (confirm(`حذف الصنف الفرعي "${subCat}"؟`)) {
          delete menuData[mainCat][subCat];
          if (Object.keys(menuData[mainCat]).length === 0) {
            delete menuData[mainCat];
          }
          saveAndRender();
        }
      };

      subHeader.appendChild(subTitle);
      subHeader.appendChild(subDelBtn);
      subDiv.appendChild(subHeader);

      const ul = document.createElement("ul");
      menuData[mainCat][subCat].forEach((item, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "center";
        li.style.justifyContent = "space-between";
        li.style.marginTop = "8px";

        const infoDiv = document.createElement("div");
        infoDiv.style.flex = "1";
        infoDiv.innerHTML = `
          <img src="${item.image}" style="max-height: 60px; max-width: 60px; margin-left: 10px;" />
          <strong>${item.name}</strong> - <em>${item.description}</em> - 
          <span style="color:#b22222;">${item.price}</span>
        `;

        const delBtn = document.createElement("button");
        delBtn.className = "delete-btn";
        delBtn.textContent = "حذف";
        delBtn.onclick = () => {
          if (confirm(`حذف "${item.name}"؟`)) {
            menuData[mainCat][subCat].splice(index, 1);
            saveAndRender();
          }
        };

        li.appendChild(infoDiv);
        li.appendChild(delBtn);
        ul.appendChild(li);
      });

      subDiv.appendChild(ul);
      mainDiv.appendChild(subDiv);
    }

    container.appendChild(mainDiv);
  }
}

init();
